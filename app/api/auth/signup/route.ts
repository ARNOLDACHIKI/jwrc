import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { generateVerificationCode, getVerificationCodeExpiration } from "@/lib/verification"
import { validatePassword } from "@/lib/password-validator"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password, phone } = body || {}
    if (!email || !password) return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })

    // Validate password strength
    const passwordValidation = validatePassword(String(password))
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { 
          error: passwordValidation.message,
          requirements: passwordValidation.requirements.filter(r => !r.met).map(r => r.label)
        }, 
        { status: 400 }
      )
    }

    // Check if user already exists
    const existing = await prisma.user.findFirst({ where: { email: { equals: String(email), mode: 'insensitive' } } })
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please login or use a different email.' }, 
        { status: 409 }
      )
    }

    // Hash password
    const hash = await bcrypt.hash(String(password), 12)
    const verificationCode = generateVerificationCode()
    const verificationCodeExpiresAt = getVerificationCodeExpiration()

    // Store pending registration in email_verifications table
    // Delete any existing pending verification for this email
    await prisma.$executeRawUnsafe(
      `DELETE FROM email_verifications WHERE LOWER(email) = LOWER($1)`,
      String(email)
    )

    // Insert new pending registration
    const userData = JSON.stringify({ name: name || '', phone: phone || '', passwordHash: hash })
    await prisma.$executeRawUnsafe(
      `INSERT INTO email_verifications (email, code, expires_at, verified, created_at, user_data) 
       VALUES ($1, $2, $3, false, NOW(), $4::jsonb)`,
      String(email).toLowerCase(),
      verificationCode,
      verificationCodeExpiresAt,
      userData
    )

    // Send verification email
    const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
    try {
      const emailResponse = await fetch(`${siteUrl}/api/auth/send-verification-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: String(email),
          name: name || 'User',
          verificationCode
        }),
      })
      const emailResult = await emailResponse.json()
      if (!emailResponse.ok) {
        console.error('Email endpoint returned error:', emailResult)
      }
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError)
      // Don't fail signup if email fails
    }

    return NextResponse.json({ 
      ok: true, 
      message: 'Verification code sent to your email. Please verify to complete registration.',
      email: String(email)
    }, { status: 200 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
