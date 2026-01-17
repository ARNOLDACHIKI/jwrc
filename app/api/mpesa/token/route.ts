import { NextResponse } from "next/server"

const SANDBOX_BASE = 'https://sandbox.safaricom.co.ke'
const LIVE_BASE = 'https://api.safaricom.co.ke'

export const dynamic = 'force-dynamic'


export async function GET() {
  try {
    const consumerKey = process.env.MPESA_CONSUMER_KEY
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET
    if (!consumerKey || !consumerSecret) return NextResponse.json({ error: 'MPESA credentials missing' }, { status: 500 })
    const env = process.env.MPESA_ENV || 'sandbox'
    const baseUrl = env === 'production' ? LIVE_BASE : SANDBOX_BASE
    const basic = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')
    const res = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: { Authorization: `Basic ${basic}` },
    })
    if (!res.ok) return NextResponse.json({ error: 'Token request failed', status: res.status }, { status: 502 })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (e: any) {
    console.error('MPESA token error', e?.message || e)
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}
