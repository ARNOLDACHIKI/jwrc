import { NextResponse } from 'next/server'
import { prisma, safeQuery, safeExecute } from '@/lib/db'
import jwt from 'jsonwebtoken'

 

function getTokenFromHeaders(req: Request) {
  const cookie = req.headers.get('cookie') || ''
  const match = cookie.split(';').map(c => c.trim()).find(c => c.startsWith('token='))
  if (!match) return null
  return match.split('=')[1]
}

async function ensureTable() {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS inbox_seen (
        user_id TEXT PRIMARY KEY,
        last_seen TIMESTAMP WITH TIME ZONE
      )
    `)
    return true
  } catch (err) {
    console.warn('Database unavailable (inbox route) — skipping table ensure:', err?.message || err)
    return false
  }
}

export async function GET(req: Request) {
  try {
    const token = getTokenFromHeaders(req)
    const secret = process.env.JWT_SECRET || 'dev-secret'
    if (!token) return NextResponse.json({ lastSeen: null, unreadCount: 0 })
    let payload: any = null
    try { payload = jwt.verify(token, secret) } catch (e) { return NextResponse.json({ lastSeen: null, unreadCount: 0 }) }
    const userId = payload.userId
    const email = payload.email

    const dbAvailable = await ensureTable()
    let row: any[] = []
    if (dbAvailable) {
      try {
        row = await safeQuery(`SELECT last_seen FROM inbox_seen WHERE user_id = $1`, String(userId))
      } catch (err) {
        console.warn('Query failed in inbox GET:', err?.message || err)
        row = []
      }
    }
    const lastSeen = row && row.length > 0 ? row[0].last_seen : null

    // compute unread from suggestions and volunteer_applications
    let unread = 0
    if (lastSeen) {
      const s: any[] = await safeQuery(`SELECT COUNT(*) as c FROM suggestions WHERE LOWER(email)=LOWER($1) AND ((responded_at IS NOT NULL AND responded_at > $2) OR (responded_at IS NULL AND created_at > $2))`, String(email), String(lastSeen))
      const v: any[] = await safeQuery(`SELECT COUNT(*) as c FROM volunteer_applications WHERE LOWER(email)=LOWER($1) AND ((responded_at IS NOT NULL AND responded_at > $2) OR (responded_at IS NULL AND created_at > $2))`, String(email), String(lastSeen))
      unread = (s[0]?.c || 0) + (v[0]?.c || 0)
    } else {
      // if never seen, count items that have admin responses/messages
      const s: any[] = await safeQuery(`SELECT COUNT(*) as c FROM suggestions WHERE LOWER(email)=LOWER($1) AND admin_response IS NOT NULL`, String(email))
      const v: any[] = await safeQuery(`SELECT COUNT(*) as c FROM volunteer_applications WHERE LOWER(email)=LOWER($1) AND admin_message IS NOT NULL`, String(email))
      unread = (s[0]?.c || 0) + (v[0]?.c || 0)
    }

    return NextResponse.json({ lastSeen: lastSeen || null, unreadCount: Number(unread) })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ lastSeen: null, unreadCount: 0 })
  }
}

export async function PATCH(req: Request) {
  try {
    const token = getTokenFromHeaders(req)
    const secret = process.env.JWT_SECRET || 'dev-secret'
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    let payload: any = null
    try { payload = jwt.verify(token, secret) } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
    const userId = payload.userId

    const dbAvailable = await ensureTable()
    if (!dbAvailable) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })
    // set last_seen to now
    await safeExecute(`INSERT INTO inbox_seen (user_id, last_seen) VALUES ($1, NOW()) ON CONFLICT (user_id) DO UPDATE SET last_seen = NOW()`, String(userId))
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
