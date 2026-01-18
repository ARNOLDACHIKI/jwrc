import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"
import { randomUUID } from "crypto"
import { getEventSignupConfirmationEmail } from "@/lib/email-templates"

const prisma = new PrismaClient()

function getTokenFromHeaders(req: Request) {
  const cookie = req.headers.get("cookie") || ""
  const match = cookie.split(";").map((c) => c.trim()).find((c) => c.startsWith("token="))
  if (!match) return null
  return match.split("=")[1]
}

async function ensureTable() {
  // create a simple signups table if it doesn't exist
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS event_signups (
      id UUID PRIMARY KEY,
      event_id UUID NOT NULL,
      ref TEXT UNIQUE,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      ticket_sent BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    )
  `)
  // ensure ref and ticket_sent columns exist (if table pre-existed without them)
  await prisma.$executeRawUnsafe(`ALTER TABLE event_signups ADD COLUMN IF NOT EXISTS ref TEXT`) 
  await prisma.$executeRawUnsafe(`ALTER TABLE event_signups ADD COLUMN IF NOT EXISTS ticket_sent BOOLEAN DEFAULT false`) 
  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS event_signups_ref_idx ON event_signups(ref)`) 
}

export const dynamic = 'force-dynamic'


export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { eventId, name, email, phone } = body || {}
    const errors: Record<string, string> = {}
    if (!eventId) errors.eventId = 'Event id is required'
    if (!name || String(name).trim().length === 0) errors.name = 'Name is required'
    if (!email || String(email).trim().length === 0) errors.email = 'Email is required'
    if (Object.keys(errors).length > 0) return NextResponse.json({ errors }, { status: 400 })

    // ensure event exists
    const ev = await prisma.event.findUnique({ where: { id: eventId } })
    if (!ev) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

    await ensureTable()

    await ensureTable()

    // dedupe: prevent same email signing up multiple times for same event
    const exists: any[] = await prisma.$queryRawUnsafe(`SELECT id FROM event_signups WHERE event_id = $1 AND lower(email) = lower($2) LIMIT 1`, eventId, String(email))
    if (exists && exists.length > 0) {
      return NextResponse.json({ error: 'Already signed up' }, { status: 409 })
    }

    // generate a short human-friendly ref
    function genRef() {
      return (Date.now()).toString(36) + Math.random().toString(36).slice(2,6)
    }

    let ref = genRef()
    // ensure unique ref
    for (let i = 0; i < 5; i++) {
      const r: any = await prisma.$queryRawUnsafe(`SELECT id FROM event_signups WHERE ref = $1 LIMIT 1`, ref)
      if (!Array.isArray(r) || r.length === 0) break
      ref = genRef()
    }

    const id = randomUUID()
    await prisma.$executeRawUnsafe(
      `INSERT INTO event_signups (id, event_id, ref, name, email, phone, created_at)
       VALUES ($1::uuid, $2::uuid, $3, $4, $5, $6, NOW())`,
      id,
      eventId,
      ref,
      String(name),
      String(email),
      phone ? String(phone) : null
    )

    // Send professional confirmation email
    try {
      if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        try {
          const nodemailer = await import('nodemailer')
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            secure: (process.env.SMTP_SECURE === 'true'),
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
          })
          
          const formatDate = (date: Date) => {
            return date.toLocaleString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          }
          
          const emailContent = getEventSignupConfirmationEmail(
            name,
            ev.title,
            formatDate(new Date(ev.startsAt)),
            ev.location || undefined,
            ref || undefined
          )
          
          await transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: String(email),
            subject: emailContent.subject,
            html: emailContent.html,
            text: emailContent.text,
          })
        } catch (e) {
          console.warn('Failed to send confirmation email', e)
        }
      }
    } catch (e) {
      console.warn('Email send skipped', e)
    }

    return NextResponse.json({ signup: { id, ref, eventId, name, email, phone } }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    // admin-only
    const token = getTokenFromHeaders(req)
    const secret = process.env.JWT_SECRET || 'dev-secret'
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    let payload: any = null
    try { payload = jwt.verify(token, secret) } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
    if (payload.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const { id } = body || {}
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    await ensureTable()
    try {
      await prisma.$executeRawUnsafe(`DELETE FROM event_signups WHERE id = $1`, id)
      return NextResponse.json({ ok: true })
    } catch (e) {
      console.error(e)
      return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
    }
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    // admin-only: requires token cookie
    const token = getTokenFromHeaders(req)
    const secret = process.env.JWT_SECRET || 'dev-secret'
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    let payload: any = null
    try {
      payload = jwt.verify(token, secret)
    } catch (e) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (payload.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const url = new URL(req.url)
    const eventId = url.searchParams.get('eventId')
    if (!eventId) return NextResponse.json({ error: 'Missing eventId' }, { status: 400 })

    await ensureTable()

    const rows: any[] = await prisma.$queryRawUnsafe(`SELECT id, ref, event_id as eventId, name, email, phone, created_at as "createdAt" FROM event_signups WHERE event_id = $1 ORDER BY created_at DESC`, eventId)

    return NextResponse.json({ signups: rows })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
