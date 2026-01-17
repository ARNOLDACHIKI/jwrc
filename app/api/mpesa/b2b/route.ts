import { NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const SANDBOX_BASE = 'https://sandbox.safaricom.co.ke'
const LIVE_BASE = 'https://api.safaricom.co.ke'

async function getOAuthToken(baseUrl: string, key: string, secret: string) {
  const basic = Buffer.from(`${key}:${secret}`).toString('base64')
  const res = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
    method: 'GET',
    headers: { Authorization: `Basic ${basic}` },
  })
  if (!res.ok) throw new Error(`OAuth request failed: ${res.status}`)
  return res.json()
}

async function ensureB2BTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS mpesa_b2b_payments (
      id SERIAL PRIMARY KEY,
      amount NUMERIC,
      party_a TEXT,
      party_b TEXT,
      account_reference TEXT,
      initiator TEXT,
      requester TEXT,
      remarks TEXT,
      provider_response JSONB,
      originator_conversation_id TEXT,
      conversation_id TEXT,
      response_code TEXT,
      response_description TEXT,
      transaction_id TEXT,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    )
  `)
}

export const dynamic = 'force-dynamic'


export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const {
      Initiator,
      SecurityCredential,
      CommandID,
      SenderIdentifierType,
      ReceiverIdentifierType,
      Amount,
      PartyA,
      PartyB,
      AccountReference,
      Requester,
      Remarks,
      QueueTimeOutURL,
      ResultURL,
      Occasion,
    } = body || {}

    // basic validations
    if (!Amount || !PartyA || !PartyB) return NextResponse.json({ error: 'Missing required fields: Amount, PartyA, PartyB' }, { status: 400 })

    const env = process.env.MPESA_ENV || 'sandbox'
    const baseUrl = env === 'production' ? LIVE_BASE : SANDBOX_BASE

    const consumerKey = process.env.MPESA_CONSUMER_KEY
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET
    if (!consumerKey || !consumerSecret) return NextResponse.json({ error: 'MPESA consumer credentials not configured' }, { status: 500 })

    // allow using env-provided initiator/credential if not supplied in body
    const initiator = Initiator || process.env.MPESA_INITIATOR || ''
    const security = SecurityCredential || process.env.MPESA_SECURITY_CREDENTIAL || ''
    const command = CommandID || 'BusinessPayBill'
    const senderIdType = SenderIdentifierType || '4'
    const receiverIdType = ReceiverIdentifierType || '4'

    if (!initiator || !security) return NextResponse.json({ error: 'Initiator or SecurityCredential not provided (or MPESA_INITIATOR/MPESA_SECURITY_CREDENTIAL missing)' }, { status: 500 })

    await ensureB2BTable()

    // create pending record
    const inserted: any = await prisma.$queryRawUnsafe(`INSERT INTO mpesa_b2b_payments (amount, party_a, party_b, account_reference, initiator, requester, remarks, status, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,'pending',NOW(),NOW()) RETURNING id`,
      Amount, PartyA, PartyB, AccountReference || null, initiator, Requester || null, Remarks || null)
    const localId = inserted?.[0]?.id || null

    // get oauth token
    const oauth = await getOAuthToken(baseUrl, consumerKey, consumerSecret)
    const accessToken = oauth?.access_token
    if (!accessToken) return NextResponse.json({ error: 'Failed to retrieve access token' }, { status: 500 })

    const payload: any = {
      Initiator: initiator,
      SecurityCredential: security,
      CommandID: command,
      SenderIdentifierType: senderIdType,
      ReceiverIdentifierType: receiverIdType,
      Amount: Amount,
      PartyA: PartyA,
      PartyB: PartyB,
      AccountReference: AccountReference || String(PartyA),
      Remarks: Remarks || 'Business to Business payment',
      QueueTimeOutURL: QueueTimeOutURL || process.env.MPESA_B2B_QUEUE_TIMEOUT_URL || `${baseUrl}/mpesa/callback`,
      ResultURL: ResultURL || process.env.MPESA_B2B_RESULT_URL || `${baseUrl}/mpesa/callback`,
    }

    if (Requester) payload.Requester = Requester
    if (Occasion) payload.Occasion = Occasion

    const res = await fetch(`${baseUrl}/mpesa/b2b/v1/paymentrequest`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json().catch(() => ({}))

    // update local record with provider response
    try {
      await prisma.$executeRawUnsafe(`UPDATE mpesa_b2b_payments SET provider_response=$1::jsonb, originator_conversation_id=$2, conversation_id=$3, response_code=$4, response_description=$5, updated_at=NOW() WHERE id=$6`,
        JSON.stringify(data || {}), data?.OriginatorConversationID || data?.originatorConversationID || null, data?.ConversationID || data?.conversationID || null,
        data?.ResponseCode || data?.responseCode || null, data?.ResponseDescription || data?.responseDescription || null, localId)
    } catch (e) {
      console.warn('Failed to update mpesa_b2b_payments with provider response', e)
    }

    return NextResponse.json({ localId, provider: data }, { status: res.ok ? 200 : 502 })
  } catch (e: any) {
    console.error('B2B payment error', e?.message || e)
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}
