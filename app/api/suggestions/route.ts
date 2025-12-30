import { NextResponse } from "next/server"
import { prisma, safeExecute, safeQuery } from '@/lib/db'
import { randomUUID } from "crypto"
import jwt from "jsonwebtoken"

async function ensureTable() {
  await safeExecute(`
    CREATE TABLE IF NOT EXISTS suggestions (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT,
      type TEXT,
      message TEXT,
      admin_response TEXT,
      responder_name TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      responded_at TIMESTAMP WITH TIME ZONE
    )
  `)
}

function getTokenFromHeaders(req: Request) {
  const cookie = req.headers.get('cookie') || ''
  const match = cookie.split(';').map(c=>c.trim()).find(c=>c.startsWith('token='))
  if (!match) return null
  return match.split('=')[1]
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, type, message } = body || {}
    const errors: Record<string,string> = {}
    if (!email) errors.email = 'Email is required'
    if (!message) errors.message = 'Message is required'
    if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 400 })

    await ensureTable()
    const id = randomUUID()
    await safeExecute(`INSERT INTO suggestions (id, name, email, type, message, created_at) VALUES ($1,$2,$3,$4,$5,NOW())`, id, name ? String(name) : null, String(email), type ? String(type) : 'suggestion', String(message))
    return NextResponse.json({ suggestion: { id, name, email, type, message } }, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    // Allow users to fetch their own suggestions by email (no auth required for convenience)
    const url = new URL(req.url)
    const email = url.searchParams.get('email')

    await ensureTable()
    if (email) {
      const rows: any[] = await safeQuery(`SELECT id, name, email, type, message, admin_response as "adminResponse", responder_name as "responderName", created_at as "createdAt", responded_at as "respondedAt" FROM suggestions WHERE LOWER(email) = LOWER($1) ORDER BY created_at DESC`, String(email))
      return NextResponse.json({ suggestions: rows })
    }

    // admin list all
    // try to obtain token from cookie or Authorization header
    let token: string | null = getTokenFromHeaders(req)
    if (!token) {
      const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')
      if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) token = authHeader.split(' ')[1]
    }
    const secret = process.env.JWT_SECRET || 'dev-secret'
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    let payload: any = null
    try { payload = jwt.verify(token, secret) } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
    // allow either admin role OR a configured admin email as a fallback
    const adminEmailFallback = process.env.ADMIN_EMAIL || ''
    if (payload.role !== 'admin' && String(payload.email || '').toLowerCase() !== adminEmailFallback.toLowerCase()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const rows: any[] = await safeQuery(`SELECT id, name, email, type, message, admin_response as "adminResponse", responder_name as "responderName", created_at as "createdAt", responded_at as "respondedAt" FROM suggestions ORDER BY created_at DESC`)
    return NextResponse.json({ suggestions: rows })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    // try to obtain token from cookie or Authorization header
    let token: string | null = getTokenFromHeaders(req)
    if (!token) {
      const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')
      if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) token = authHeader.split(' ')[1]
    }
    const secret = process.env.JWT_SECRET || 'dev-secret'
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    let payload: any = null
    try { payload = jwt.verify(token, secret) } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
    const adminEmailFallback = process.env.ADMIN_EMAIL || ''
    if (payload.role !== 'admin' && String(payload.email || '').toLowerCase() !== adminEmailFallback.toLowerCase()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const { id, response, responderName } = body || {}
    if (!id || !response) return NextResponse.json({ error: 'Missing id or response' }, { status: 400 })

    await ensureTable()
    const responder = responderName || payload.email || payload.name || 'admin'
    await safeExecute(`UPDATE suggestions SET admin_response = $1, responder_name = $3, responded_at = NOW() WHERE id = $2`, String(response), id, String(responder))
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
