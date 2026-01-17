import { NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'


export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const localIdRaw = url.searchParams.get('localId')
    if (!localIdRaw) return NextResponse.json({ error: 'localId required' }, { status: 400 })
    const localId = parseInt(localIdRaw, 10)
    if (Number.isNaN(localId)) return NextResponse.json({ error: 'localId must be an integer' }, { status: 400 })

    const rows: any = await prisma.$queryRawUnsafe(`SELECT id, amount, phone, account_reference, merchant_request_id, checkout_request_id, status, mpesa_transaction_id, provider_response FROM mpesa_donations WHERE id=$1::int LIMIT 1`, localId)
    const rec = rows?.[0] || null
    if (!rec) return NextResponse.json({ error: 'not found' }, { status: 404 })
    return NextResponse.json({ donation: rec })
  } catch (e: any) {
    console.error('mpesa status error', e)
    return NextResponse.json({ error: e?.message || 'server error' }, { status: 500 })
  }
}
