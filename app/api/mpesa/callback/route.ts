import { NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function extractMpesaReceipt(callbackBody: any) {
  try {
    const items = callbackBody?.stkCallback?.CallbackMetadata?.Item || []
    for (const it of items) {
      if ((it?.Name || '').toLowerCase().includes('receipt') || (it?.Name || '').toLowerCase().includes('mpesareceiptnumber') || (it?.Name || '').toLowerCase().includes('mpesareceiptnumber')) {
        return it?.Value
      }
      if ((it?.Name || '').toLowerCase().includes('transaction')) return it?.Value
    }
  } catch (e) {
    // ignore
  }
  return null
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    console.log('MPESA Callback received', JSON.stringify(body))

    // Attempt to extract identifiers
    const callback = body?.Body || body || {}
    const stk = callback?.stkCallback || callback?.stkCallback || null
    const merchantRequestId = stk?.MerchantRequestID || stk?.merchantRequestID || null
    const checkoutRequestId = stk?.CheckoutRequestID || stk?.checkoutRequestID || null
    const resultCode = stk?.ResultCode ?? stk?.resultCode ?? null
    const resultDesc = stk?.ResultDesc || stk?.ResultDesc || null

    // Try to match existing mpesa_donations by checkout_request_id or merchant_request_id
    let found: any = null
    if (checkoutRequestId) {
      const rows: any = await prisma.$queryRawUnsafe(`SELECT id FROM mpesa_donations WHERE checkout_request_id=$1 LIMIT 1`, checkoutRequestId)
      found = rows?.[0]
    }
    if (!found && merchantRequestId) {
      const rows: any = await prisma.$queryRawUnsafe(`SELECT id FROM mpesa_donations WHERE merchant_request_id=$1 LIMIT 1`, merchantRequestId)
      found = rows?.[0]
    }

    const mpesaReceipt = extractMpesaReceipt(stk || callback)

    if (found?.id) {
      const status = resultCode === 0 ? 'success' : 'failed'
      await prisma.$executeRawUnsafe(`UPDATE mpesa_donations SET status=$1, mpesa_transaction_id=$2, response_code=$3, response_description=$4, provider_response=$5::jsonb, updated_at=NOW() WHERE id=$6`,
        status, mpesaReceipt || null, String(resultCode), resultDesc || null, JSON.stringify(body || {}), found.id)
      console.log('Updated mpesa_donations id', found.id, 'status', status)
    } else {
      console.warn('No matching mpesa_donations record found for callback', { checkoutRequestId, merchantRequestId })
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('MPESA callback error', e?.message || e)
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}
