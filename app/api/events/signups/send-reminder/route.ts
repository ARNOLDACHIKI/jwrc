import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

function getTokenFromHeaders(req: Request) {
  const cookie = req.headers.get("cookie") || ""
  const match = cookie.split(";").map((c) => c.trim()).find((c) => c.startsWith("token="))
  if (!match) return null
  return match.split("=")[1]
}

export async function POST(req: Request) {
  try {
    // admin-only
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

    const body = await req.json()
    const { eventId, signupIds } = body || {}
    
    if (!eventId) return NextResponse.json({ error: 'Missing eventId' }, { status: 400 })

    // Get event details
    const event = await prisma.event.findUnique({ where: { id: eventId } })
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

    // Get signups to send reminders to
    let signups: any[] = []
    if (signupIds && Array.isArray(signupIds) && signupIds.length > 0) {
      // Send to specific signups
      const placeholders = signupIds.map((_, i) => `$${i + 2}`).join(',')
      signups = await prisma.$queryRawUnsafe(
        `SELECT id, name, email, phone FROM event_signups WHERE event_id = $1 AND id IN (${placeholders})`,
        eventId,
        ...signupIds
      )
    } else {
      // Send to all signups for this event
      signups = await prisma.$queryRawUnsafe(
        `SELECT id, name, email, phone FROM event_signups WHERE event_id = $1`,
        eventId
      )
    }

    if (signups.length === 0) {
      return NextResponse.json({ error: 'No signups found' }, { status: 404 })
    }

    // Check if SMTP is configured
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
      return NextResponse.json({ 
        error: 'Email not configured. Please set SMTP environment variables.',
        details: 'SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_PORT are required'
      }, { status: 500 })
    }

    // Send reminder emails
    const nodemailer = await import('nodemailer')
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: (process.env.SMTP_SECURE === 'true'),
      auth: { 
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASS 
      },
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

    let sent = 0
    let failed = 0

    for (const signup of signups) {
      try {
        const emailContent = `
Dear ${signup.name},

This is a friendly reminder about the upcoming event you signed up for:

Event: ${event.title}
${event.description ? `\n${event.description}\n` : ''}
Date & Time: ${formatDate(new Date(event.startsAt))}
${event.location ? `Location: ${event.location}\n` : ''}

We look forward to seeing you there!

If you have any questions, please don't hesitate to contact us.

Best regards,
${process.env.SITE_NAME || 'Jesus Worship and Restoration Church'}
        `.trim()

        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: signup.email,
          subject: `Reminder: ${event.title}`,
          text: emailContent,
        })

        sent++
      } catch (e) {
        console.error(`Failed to send reminder to ${signup.email}:`, e)
        failed++
      }
    }

    return NextResponse.json({ 
      success: true,
      sent,
      failed,
      total: signups.length,
      message: `Sent ${sent} reminder(s) successfully${failed > 0 ? `, ${failed} failed` : ''}`
    }, { status: 200 })

  } catch (err) {
    console.error('Send reminder error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
