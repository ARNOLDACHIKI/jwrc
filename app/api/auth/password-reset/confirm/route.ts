import { NextResponse } from "next/server"
import { prisma, safeExecute, safeQuery } from '@/lib/db'
import bcrypt from "bcryptjs"

async function ensureTable() {
  await safeExecute(`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token TEXT NOT NULL,
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
      used BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      used_at TIMESTAMP WITH TIME ZONE
    )
  `)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { token, password } = body || {}
    if (!token || !password) return NextResponse.json({ error: 'Token and password required' }, { status: 400 })

    await ensureTable()
    const rows: any[] = await safeQuery(`SELECT id, user_id, token, expires_at, used FROM password_reset_tokens WHERE token = $1 LIMIT 1`, String(token))
    const row = rows && rows.length ? rows[0] : null
    if (!row) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
    if (row.used) return NextResponse.json({ error: 'Token already used' }, { status: 400 })
    if (new Date(row.expires_at) < new Date()) return NextResponse.json({ error: 'Token expired' }, { status: 400 })

    const hash = await bcrypt.hash(String(password), 12)
    await safeExecute(`UPDATE "User" SET password = $1 WHERE id = $2`, hash, row.user_id)
    await safeExecute(`UPDATE password_reset_tokens SET used = true, used_at = NOW() WHERE id = $1`, row.id)

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
