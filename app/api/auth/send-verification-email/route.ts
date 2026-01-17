import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { getEmailVerificationEmail } from "@/lib/email-templates"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, name, verificationCode } = body || {}

    if (!email || !verificationCode) {
      return NextResponse.json({ error: 'Email and verification code are required' }, { status: 400 })
    }

    let transporter

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      // Production email configuration
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })
    } else {
      // Development: Create a test account with Ethereal
      const testAccount = await nodemailer.createTestAccount()
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      })
    }

    const displayName = name || 'Member'
    const emailTemplate = getEmailVerificationEmail(displayName, verificationCode)

    // Send email
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Church Community" <noreply@church.org>',
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    })

    console.log('Email verification sent:', info.messageId)

    // Log preview URL if using Ethereal (development)
    if (process.env.NODE_ENV === 'development' && !process.env.SMTP_HOST) {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info))
    }

    return NextResponse.json({ ok: true, messageId: info.messageId }, { status: 200 })
  } catch (e) {
    console.error('Error sending verification email:', e)
    return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 })
  }
}
