import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

function getTokenFromHeaders(req: Request) {
  const cookie = req.headers.get('cookie') || ''
  const match = cookie.split(';').map(c => c.trim()).find(c => c.startsWith('token='))
  if (!match) return null
  return match.split('=')[1]
}

async function ensureTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS inbox_seen (
      user_id TEXT PRIMARY KEY,
      last_seen TIMESTAMP WITH TIME ZONE
    )
  `)
}

export const dynamic = 'force-dynamic'


export async function GET(req: Request) {
  try {
    const token = getTokenFromHeaders(req)
    const secret = process.env.JWT_SECRET || 'dev-secret'
    if (!token) return NextResponse.json({ lastSeen: null, unreadCount: 0 })
    let payload: any = null
    try { payload = jwt.verify(token, secret) } catch (e) { return NextResponse.json({ lastSeen: null, unreadCount: 0 }) }
    const userId = payload.userId
    const email = payload.email

    await ensureTable()
    const row: any[] = await prisma.$queryRawUnsafe(`SELECT last_seen FROM inbox_seen WHERE user_id = $1`, String(userId))
    const lastSeen = row && row.length > 0 ? row[0].last_seen : null

    // compute unread from suggestions and volunteer_applications
    let unread = 0
    if (lastSeen) {
      try {
        // Convert timestamp to ISO format for PostgreSQL
        const lastSeenISO = lastSeen instanceof Date ? lastSeen.toISOString() : new Date(lastSeen).toISOString()
        const s: any[] = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as c FROM suggestions WHERE LOWER(email)=LOWER($1) AND ((responded_at IS NOT NULL AND responded_at > $2::timestamptz) OR (responded_at IS NULL AND created_at > $2::timestamptz))`, String(email), lastSeenISO)
        const v: any[] = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as c FROM volunteer_applications WHERE LOWER(email)=LOWER($1) AND ((responded_at IS NOT NULL AND responded_at > $2::timestamptz) OR (responded_at IS NULL AND created_at > $2::timestamptz))`, String(email), lastSeenISO)
        unread = (s[0]?.c || 0) + (v[0]?.c || 0)
      } catch (e) {
        console.error("Error counting unread:", e)
        unread = 0
      }
    } else {
      try {
        // if never seen, count items that have admin responses/messages
        const s: any[] = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as c FROM suggestions WHERE LOWER(email)=LOWER($1) AND admin_response IS NOT NULL`, String(email))
        const v: any[] = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as c FROM volunteer_applications WHERE LOWER(email)=LOWER($1) AND admin_message IS NOT NULL`, String(email))
        unread = (s[0]?.c || 0) + (v[0]?.c || 0)
      } catch (e) {
        console.error("Error counting new unread:", e)
        unread = 0
      }
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

    await ensureTable()
    // set last_seen to now
    await prisma.$executeRawUnsafe(`INSERT INTO inbox_seen (user_id, last_seen) VALUES ($1, NOW()) ON CONFLICT (user_id) DO UPDATE SET last_seen = NOW()`, String(userId))
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
