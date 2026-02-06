import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"
import { randomUUID } from "crypto"
import { getEventTicketEmail } from "@/lib/email-templates"
import { generateTicketQRCode } from "@/lib/qrcode"

const prisma = new PrismaClient()

function getTokenFromHeaders(req: Request) {
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization")
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7)
  }
  const cookie = req.headers.get("cookie") || ""
  const match = cookie.split(";").map((c) => c.trim()).find((c) => c.startsWith("token="))
  if (!match) return null
  return match.split("=")[1]
}



export const dynamic = 'force-dynamic'


export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { eventId } = body || {}
    const errors: Record<string, string> = {}
    if (!eventId) errors.eventId = 'Event id is required'
    if (Object.keys(errors).length > 0) return NextResponse.json({ errors }, { status: 400 })

    // require auth
    const token = getTokenFromHeaders(req)
    const secret = process.env.JWT_SECRET || 'dev-secret'
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    let payload: any = null
    try { payload = jwt.verify(token, secret) } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }

    // fetch user profile
    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    console.log('=== EVENT SIGNUP DEBUG ===')
    console.log('JWT Payload:', payload)
    console.log('User from DB:', { id: user.id, name: user.name, email: user.email })
    console.log('========================')

    const name = user.name || user.email
    const email = user.email
    const phone = user.phone || null

    // ensure event exists
    const ev = await prisma.event.findUnique({ where: { id: eventId } })
    if (!ev) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

    // dedupe: prevent same email signing up multiple times for same event
    const exists = await prisma.eventSignup.findFirst({
      where: {
        eventId: eventId,
        email: {
          equals: email,
          mode: 'insensitive'
        }
      }
    })
    if (exists) {
      return NextResponse.json({ error: 'Already signed up' }, { status: 409 })
    }

    // generate a short human-friendly ref
    function genRef() {
      return (Date.now()).toString(36) + Math.random().toString(36).slice(2,6)
    }

    let ref = genRef()
    // ensure unique ref
    for (let i = 0; i < 5; i++) {
      const r = await prisma.eventSignup.findFirst({ where: { ref } })
      if (!r) break
      ref = genRef()
    }

    const signup = await prisma.eventSignup.create({
      data: {
        eventId,
        ref,
        name: String(name),
        email: String(email),
        phone: phone ? String(phone) : null
      }
    })

    // Send ticket email with QR code
    try {
      if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        try {
          // Generate QR code for ticket
          const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
          const qrCodeDataURL = await generateTicketQRCode({
            eventId: signup.eventId,
            signupId: signup.id,
            ref: ref || '',
            name: name,
            email: email,
            baseUrl: baseUrl
          })

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
          
          const emailContent = getEventTicketEmail(
            name,
            ev.title,
            formatDate(new Date(ev.startsAt)),
            ev.location || undefined,
            ref || '',
            qrCodeDataURL
          )
          
          await transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: String(email),
            subject: emailContent.subject,
            html: emailContent.html,
            text: emailContent.text,
          })

          // Mark ticket as sent
          await prisma.eventSignup.update({
            where: { id: signup.id },
            data: { ticketSent: true }
          })
        } catch (e) {
          console.warn('Failed to send ticket email', e)
        }
      }
    } catch (e) {
      console.warn('Email send skipped', e)
    }

    return NextResponse.json({ signup: { id: signup.id, ref: signup.ref, eventId: signup.eventId, name: signup.name, email: signup.email, phone: signup.phone } }, { status: 201 })
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

    try {
      await prisma.eventSignup.delete({ where: { id } })
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
    const token = getTokenFromHeaders(req)
    const secret = process.env.JWT_SECRET || 'dev-secret'
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    let payload: any = null
    try {
      payload = jwt.verify(token, secret)
    } catch (e) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(req.url)
    const eventId = url.searchParams.get('eventId')
    const email = url.searchParams.get('email')

    // Admin fetching signups for a specific event
    if (eventId) {
      if (payload.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

      const signups = await prisma.eventSignup.findMany({
        where: { eventId },
        orderBy: { createdAt: 'desc' }
      })

      // Convert to match expected format
      const rows = signups.map(s => ({
        id: s.id,
        ref: s.ref,
        eventId: s.eventId,
        name: s.name,
        email: s.email,
        phone: s.phone,
        createdAt: s.createdAt,
        ticket_sent: false,
        checked_in: false
      }))

      return NextResponse.json({ signups: rows })
    }

    // User fetching their own signups
    if (email) {
      const user = await prisma.user.findUnique({ where: { id: payload.userId } })
      if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 })
      
      // Only allow users to fetch their own signups (unless admin)
      if (user.email !== email && payload.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      const signups = await prisma.eventSignup.findMany({
        where: { 
          email: {
            equals: email,
            mode: 'insensitive'
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      // Fetch event details for each signup
      const signupsWithEvents = await Promise.all(
        signups.map(async (s) => {
          const event = await prisma.event.findUnique({
            where: { id: s.eventId },
            select: {
              id: true,
              title: true,
              startsAt: true,
              endsAt: true,
              location: true
            }
          })
          return {
            id: s.id,
            ref: s.ref,
            eventId: s.eventId,
            name: s.name,
            email: s.email,
            phone: s.phone,
            createdAt: s.createdAt,
            event
          }
        })
      )

      return NextResponse.json(signupsWithEvents)
    }

    return NextResponse.json({ error: 'Missing eventId or email parameter' }, { status: 400 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
