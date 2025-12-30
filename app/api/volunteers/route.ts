import { NextResponse } from "next/server"
import { prisma, safeExecute, safeQuery } from '@/lib/db'
import { randomUUID } from "crypto"
import jwt from "jsonwebtoken"

async function ensureTable() {
  await safeExecute(`
    CREATE TABLE IF NOT EXISTS volunteer_applications (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      role_id TEXT,
      role_title TEXT,
      status TEXT DEFAULT 'pending',
      admin_message TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      responded_at TIMESTAMP WITH TIME ZONE
    )
  `)
  await safeExecute(`ALTER TABLE volunteer_applications ADD COLUMN IF NOT EXISTS admin_message TEXT`)
}

function getTokenFromHeaders(req: Request) {
  const cookie = req.headers.get('cookie') || ''
  const match = cookie.split(';').map(c=>c.trim()).find(c=>c.startsWith('token='))
  if (!match) return null
  return match.split('=')[1]
}

export async function POST(req: Request) {
  // public: submit volunteer application
  try {
    const body = await req.json()
    const { name, email, phone, roleId, roleTitle } = body || {}
    const errors: Record<string,string> = {}
    if (!name) errors.name = 'Name is required'
    if (!email) errors.email = 'Email is required'
    if (!roleId && !roleTitle) errors.role = 'Role is required'
    if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 400 })

    await ensureTable()
    const id = randomUUID()
    await safeExecute(`INSERT INTO volunteer_applications (id, name, email, phone, role_id, role_title, status, created_at) VALUES ($1,$2,$3,$4,$5,$6,'pending',NOW())`, id, String(name), String(email), phone ? String(phone) : null, roleId ? String(roleId) : null, roleTitle ? String(roleTitle) : null)
    return NextResponse.json({ application: { id, name, email, phone, roleId, roleTitle, status: 'pending' } }, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const forEmail = url.searchParams.get('email')
    // if email provided return applications for that email (public for user dashboard)
    await ensureTable()
    if (forEmail) {
      const rows: any[] = await safeQuery(`SELECT id, name, email, phone, role_id as "roleId", role_title as "roleTitle", status, admin_message as "adminMessage", created_at as "createdAt", responded_at as "respondedAt" FROM volunteer_applications WHERE lower(email) = lower($1) ORDER BY created_at DESC`, forEmail)
      return NextResponse.json({ applications: rows })
    }

    // admin-only: list all
    const token = getTokenFromHeaders(req)
    const secret = process.env.JWT_SECRET || 'dev-secret'
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    let payload: any = null
    try { payload = jwt.verify(token, secret) } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
    if (payload.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const rows: any[] = await safeQuery(`SELECT id, name, email, phone, role_id as "roleId", role_title as "roleTitle", status, admin_message as "adminMessage", created_at as "createdAt", responded_at as "respondedAt" FROM volunteer_applications ORDER BY created_at DESC`)
    return NextResponse.json({ applications: rows })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  // admin respond (approve/reject)
  try {
    const token = getTokenFromHeaders(req)
    const secret = process.env.JWT_SECRET || 'dev-secret'
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    let payload: any = null
    try { payload = jwt.verify(token, secret) } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
    if (payload.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const { id, action, message } = body || {}
    if (!id || !action) return NextResponse.json({ error: 'Missing id or action' }, { status: 400 })
    if (!['approve','reject'].includes(action)) return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

    await ensureTable()
    const status = action === 'approve' ? 'approved' : 'rejected'
    await safeExecute(`UPDATE volunteer_applications SET status = $1, admin_message = $2, responded_at = NOW() WHERE id = $3`, status, message ? String(message) : null, id)
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
