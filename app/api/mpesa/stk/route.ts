import { NextResponse } from "next/server"
import { prisma, safeExecute, safeQuery } from '@/lib/db'
const SANDBOX_BASE = 'https://sandbox.safaricom.co.ke'
const LIVE_BASE = 'https://api.safaricom.co.ke'

function formatTimestamp(d = new Date()) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    d.getFullYear().toString() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  )
}

async function getOAuthToken(baseUrl: string, key: string, secret: string) {
  const basic = Buffer.from(`${key}:${secret}`).toString('base64')
  const res = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
    method: 'GET',
    headers: { Authorization: `Basic ${basic}` },
  })
  if (!res.ok) throw new Error(`OAuth request failed: ${res.status}`)
  return res.json()
}

async function ensureMpesaTable() {
  await safeExecute(`
    CREATE TABLE IF NOT EXISTS mpesa_donations (
      id SERIAL PRIMARY KEY,
      amount NUMERIC,
      phone TEXT,
      account_reference TEXT,
      transaction_desc TEXT,
      merchant_request_id TEXT,
      checkout_request_id TEXT,
      response_code TEXT,
      response_description TEXT,
      provider_response JSONB,
      mpesa_transaction_id TEXT,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    )
  `)
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { phone, amount, accountReference, transactionDesc } = body || {}
    if (!phone || !amount) return NextResponse.json({ error: 'Missing phone or amount' }, { status: 400 })

    // Normalize and validate phone number
    let normalizedPhone = String(phone).replace(/\D/g, '') // Remove non-digits
    
    // Handle different formats: 0712345678, 712345678, 254712345678, +254712345678
    if (normalizedPhone.startsWith('0')) {
      normalizedPhone = '254' + normalizedPhone.substring(1)
    } else if (normalizedPhone.startsWith('7') || normalizedPhone.startsWith('1')) {
      normalizedPhone = '254' + normalizedPhone
    }
    
    // Validate format: Must be 254XXXXXXXXX (12 digits)
    if (!/^254\d{9}$/.test(normalizedPhone)) {
      return NextResponse.json({ 
        error: 'Invalid phone number format. Use 254XXXXXXXXX (e.g., 254712345678)' 
      }, { status: 400 })
    }

    const env = process.env.MPESA_ENV || 'sandbox'
    const baseUrl = env === 'production' ? LIVE_BASE : SANDBOX_BASE

    const consumerKey = process.env.MPESA_CONSUMER_KEY
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET
    let shortcode = process.env.MPESA_SHORTCODE
    let passkey = process.env.MPESA_PASSKEY
    const callbackUrl = process.env.MPESA_CALLBACK_URL || `${baseUrl}/` // fallback

    if (!consumerKey || !consumerSecret) return NextResponse.json({ error: 'MPESA consumer credentials not configured' }, { status: 500 })

    // For local sandbox testing, many Daraja sandboxes use shortcode 174379 with a known passkey.
    // If running in sandbox and the configured shortcode/passkey appears to be a real Paybill
    // (e.g. 247247) that the sandbox does not recognise, fall back to the common sandbox
    // credentials to allow testing. In production do not override.
    if (env === 'sandbox') {
      const sandboxShortcode = '174379'
      const sandboxPasskey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'
      if (!shortcode || !passkey || shortcode === '247247') {
        console.warn('Using sandbox shortcode/passkey fallback for STK testing')
        shortcode = sandboxShortcode
        passkey = sandboxPasskey
      }
    }

    if (!shortcode || !passkey) return NextResponse.json({ error: 'MPESA shortcode or passkey not configured (and no sandbox fallback available)' }, { status: 500 })

    await ensureMpesaTable()

    // create pending record before calling provider
    const inserted: any = await safeQuery(`INSERT INTO mpesa_donations (amount, phone, account_reference, transaction_desc, status, created_at, updated_at) VALUES ($1,$2,$3,$4,'pending',NOW(),NOW()) RETURNING id`,
      amount, normalizedPhone, accountReference || null, transactionDesc || null)
    const localId = inserted?.[0]?.id || null

    // 1) Get OAuth token
    let oauth: any
    try {
      oauth = await getOAuthToken(baseUrl, consumerKey, consumerSecret)
    } catch (oauthErr: any) {
      console.error('OAuth token fetch failed:', oauthErr?.message || oauthErr)
      return NextResponse.json({ error: 'Failed to get OAuth token from M-Pesa', details: oauthErr?.message }, { status: 502 })
    }
    const accessToken = oauth?.access_token
    if (!accessToken) {
      console.error('OAuth response missing access_token:', oauth)
      return NextResponse.json({ error: 'Failed to retrieve access token', oauth }, { status: 500 })
    }

    // 2) Build password and timestamp
    const timestamp = formatTimestamp()
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64')

    const stkBody = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: normalizedPhone,
      PartyB: shortcode,
      PhoneNumber: normalizedPhone,
      CallBackURL: callbackUrl,
      AccountReference: accountReference || String(normalizedPhone),
      TransactionDesc: transactionDesc || 'Donation',
    }

    const stkRes = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stkBody),
    })

    const data = await stkRes.json().catch(() => ({}))
    
    if (!stkRes.ok) {
      console.error('STK Push API failed:', { status: stkRes.status, statusText: stkRes.statusText, response: data })
    }

    // update local record with provider response identifiers
    try {
      await safeExecute(`UPDATE mpesa_donations SET merchant_request_id=$1, checkout_request_id=$2, response_code=$3, response_description=$4, provider_response=$5::jsonb, updated_at=NOW() WHERE id=$6`,
        data?.MerchantRequestID || data?.merchantRequestID || null,
        data?.CheckoutRequestID || data?.checkoutRequestID || null,
        data?.ResponseCode || data?.responseCode || null,
        data?.ResponseDescription || data?.responseDescription || null,
        JSON.stringify(data || {}),
        localId)
    } catch (e) {
      console.warn('Failed to update mpesa_donations with provider response', e)
    }

    return NextResponse.json({ localId, provider: data }, { status: stkRes.ok ? 200 : 502 })
  } catch (e: any) {
    console.error('STK Push error', e?.message || e)
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}
