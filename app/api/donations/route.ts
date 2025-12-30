import { NextResponse } from "next/server"
import { safeExecute, safeQuery } from '@/lib/db'

async function ensureTable() {
  await safeExecute(`
    CREATE TABLE IF NOT EXISTS donations (
      id SERIAL PRIMARY KEY,
      amount NUMERIC,
      currency TEXT,
      kes_amount INTEGER,
      method TEXT,
      donor_name TEXT,
      donor_email TEXT,
      note TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    )
  `)
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
    const { amount, currency, kesAmount, method, donor } = body || {}
    if (!amount || !method) return NextResponse.json({ error: 'Missing amount or method' }, { status: 400 })

    await ensureTable()
    await safeExecute(`INSERT INTO donations (amount, currency, kes_amount, method, donor_name, donor_email, note, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,NOW())`,
      amount, currency || 'USD', kesAmount || null, method, donor?.name || null, donor?.email || null, body?.note || null)

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    await ensureTable()
    await ensureMpesaTable()

    const manual = await safeQuery<any>(
      `SELECT id, amount, currency, kes_amount, method, donor_name, donor_email, note, created_at
       FROM donations
       ORDER BY created_at DESC
       LIMIT 200`
    )

    const mpesa = await safeQuery<any>(
      `SELECT id, amount, phone, account_reference, transaction_desc, merchant_request_id, checkout_request_id,
              response_code, response_description, provider_response, mpesa_transaction_id, status,
              created_at, updated_at
       FROM mpesa_donations
       ORDER BY created_at DESC
       LIMIT 200`
    )

    const normalizeAmount = (val: any) => {
      const n = Number(val)
      return Number.isFinite(n) ? n : 0
    }

    const rows = [
      ...manual.map((d: any) => ({
        id: `manual-${d.id}`,
        type: 'manual',
        amount: normalizeAmount(d.amount || d.kes_amount),
        currency: d.currency || 'KES',
        method: d.method || 'mpesa',
        donorName: d.donor_name || 'Anonymous',
        donorEmail: d.donor_email || null,
        note: d.note || null,
        status: 'recorded',
        createdAt: d.created_at,
      })),
      ...mpesa.map((d: any) => ({
        id: `mpesa-${d.id}`,
        type: 'mpesa',
        amount: normalizeAmount(d.amount),
        currency: 'KES',
        method: 'mpesa',
        phone: d.phone,
        accountReference: d.account_reference,
        checkoutRequestId: d.checkout_request_id,
        merchantRequestId: d.merchant_request_id,
        mpesaReceipt: d.mpesa_transaction_id,
        providerResponse: d.provider_response,
        status: d.status || 'pending',
        createdAt: d.created_at,
        updatedAt: d.updated_at,
        description: d.transaction_desc,
        responseCode: d.response_code,
        responseDescription: d.response_description,
      })),
    ].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({ donations: rows })
  } catch (e: any) {
    console.error('donations GET error', e?.message || e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
