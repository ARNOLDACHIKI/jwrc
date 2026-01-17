import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function ensureTable() {
  await prisma.$executeRawUnsafe(`
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

export const dynamic = 'force-dynamic'


export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { amount, currency, kesAmount, method, donor } = body || {}
    if (!amount || !method) return NextResponse.json({ error: 'Missing amount or method' }, { status: 400 })

    await ensureTable()
    await prisma.$executeRawUnsafe(`INSERT INTO donations (amount, currency, kes_amount, method, donor_name, donor_email, note, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,NOW())`,
      amount, currency || 'USD', kesAmount || null, method, donor?.name || null, donor?.email || null, body?.note || null)

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
