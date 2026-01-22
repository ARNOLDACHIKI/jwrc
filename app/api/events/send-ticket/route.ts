import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import nodemailer from "nodemailer"
import jwt from "jsonwebtoken"
import { generateTicketQRCode } from "@/lib/qrcode"
import { getEventTicketEmail } from "@/lib/email-templates"

const prisma = new PrismaClient()

function getTokenFromHeaders(req: Request) {
  const cookie = req.headers.get("cookie") || ""
  const match = cookie.split(";").map((c) => c.trim()).find((c) => c.startsWith("token="))
  if (!match) return null
  return match.split("=")[1]
}

export const dynamic = 'force-dynamic'


export async function POST(req: Request) {
  try {
    // Verify admin authentication
    const token = getTokenFromHeaders(req)
    const secret = process.env.JWT_SECRET || 'dev-secret'
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    let payload: any = null
    try { 
      payload = jwt.verify(token, secret) 
    } catch (e) { 
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) 
    }
    
    if (payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const body = await req.json()
    const { signupId, eventId } = body || {}

    if (!signupId) {
      return NextResponse.json({ error: 'Signup ID is required' }, { status: 400 })
    }

    // Get signup details from EventSignup table
    const signup = await prisma.eventSignup.findUnique({
      where: { id: signupId }
    })

    if (!signup) {
      return NextResponse.json({ error: 'Event signup not found' }, { status: 404 })
    }
    
    // Get event details
    const event = await prisma.event.findUnique({ 
      where: { id: signup.eventId } 
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Generate QR code with ticket data
    const qrCodeDataURL = await generateTicketQRCode({
      eventId: signup.eventId,
      signupId: signup.id,
      ref: signup.ref || '',
      name: signup.name,
      email: signup.email
    })

    // Send email with QR code ticket
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      )
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
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

    // Extract base64 data from data URL
    const base64Data = qrCodeDataURL.split(',')[1]

    const emailContent = getEventTicketEmail(
      signup.name,
      event.title,
      formatDate(new Date(event.startsAt)),
      event.location || undefined,
      signup.ref || 'N/A',
      'cid:qrcode@ticket' // Use CID reference
    )

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: signup.email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
      attachments: [
        {
          filename: 'qrcode.png',
          content: base64Data,
          encoding: 'base64',
          cid: 'qrcode@ticket' // Same CID as referenced in the HTML
        }
      ]
    })

    return NextResponse.json({
      ok: true,
      message: 'Ticket sent successfully',
      email: signup.email
    }, { status: 200 })

  } catch (error) {
    console.error('Error sending ticket:', error)
    return NextResponse.json(
      { error: 'Failed to send ticket' },
      { status: 500 }
    )
  }
}
