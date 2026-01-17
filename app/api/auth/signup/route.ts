import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { generateVerificationCode, getVerificationCodeExpiration } from "@/lib/verification"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password, phone } = body || {}
    if (!email || !password) return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })

    // check exists
    const existing = await prisma.user.findFirst({ where: { email: { equals: String(email), mode: 'insensitive' } } })
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please login or use a different email.' }, 
        { status: 409 }
      )
    }

    const hash = await bcrypt.hash(String(password), 12)
    const verificationCode = generateVerificationCode()
    const verificationCodeExpiresAt = getVerificationCodeExpiration()

    const user = await prisma.user.create({ 
      data: { 
        email: String(email), 
        name: name ? String(name) : undefined, 
        phone: phone ? String(phone) : undefined,
        password: hash,
        verificationCode,
        verificationCodeExpiresAt
      } 
    })

    const secret = process.env.JWT_SECRET || 'dev-secret'
    const token = jwt.sign({ userId: user.id, role: user.role, email: user.email }, secret, { expiresIn: '7d' })
    const cookie = `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`

    // Send verification email
    try {
      await fetch(`${req.headers.get('origin')}/api/auth/send-verification-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: user.email, 
          name: user.name,
          verificationCode
        }),
      })
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError)
      // Don't fail signup if email fails
    }

    // Send welcome email (after verification)
    try {
      await fetch(`${req.headers.get('origin')}/api/auth/send-welcome-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, name: user.name }),
      })
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
      // Don't fail signup if email fails
    }

    return NextResponse.json({ ok: true, token }, { status: 201, headers: { 'Set-Cookie': cookie } })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
