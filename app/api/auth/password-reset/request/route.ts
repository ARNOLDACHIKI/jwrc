import { NextResponse } from "next/server"
import { prisma, safeExecute } from '@/lib/db'
import { randomBytes } from "crypto"
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
  await safeExecute(`CREATE INDEX IF NOT EXISTS password_reset_tokens_token_idx ON password_reset_tokens(token)`)
}

async function findUserByEmail(email: string) {
  // try exact then case-insensitive
  let user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    try {
      user = await prisma.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } })
    } catch (e) {
      // ignore
    }
  }
  return user
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email } = body || {}
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

    const user = await findUserByEmail(String(email))
    // do not reveal whether user exists
    await ensureTable()
    if (!user) return NextResponse.json({ ok: true })

    const token = randomBytes(24).toString('hex')
    const id = randomBytes(12).toString('hex')
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

    await safeExecute(`INSERT INTO password_reset_tokens (id, user_id, token, expires_at, used, created_at) VALUES ($1,$2,$3,$4,false,NOW())`, id, user.id, token, expiresAt)

    // try to send email if SMTP configured
    let emailSent = false
    try {
      if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        const nodemailer = await import('nodemailer')
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: (process.env.SMTP_SECURE === 'true'),
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        })
        const site = process.env.SITE_URL || 'http://localhost:3000'
        const resetLink = `${site}/reset-password?token=${token}`
        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: user.email,
          subject: 'Password reset request',
          text: `You requested a password reset. Use this link to reset your password: ${resetLink} (expires in 1 hour)`
        })
        emailSent = true
        console.log('Password reset email sent to:', user.email)
      }
    } catch (e) {
      console.warn('Failed to send password reset email', e)
    }

    // In development, always return token for manual testing (useful for testing the reset flow)
    const isDev = (process.env.NODE_ENV || 'development') === 'development'
    if (isDev) {
      return NextResponse.json({ ok: true, token, emailSent })
    }

    // In production, only return token if email send failed (for debugging)
    if (!emailSent) {
      return NextResponse.json({ ok: true, token })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
