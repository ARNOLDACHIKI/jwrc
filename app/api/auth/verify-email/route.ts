import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { validateVerificationCode } from "@/lib/verification"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, verificationCode } = body || {}

    if (!email || !verificationCode) {
      return NextResponse.json(
        { error: 'Email and verification code are required' },
        { status: 400 }
      )
    }

    // Check for pending registration in email_verifications
    const pendingRows: any[] = await prisma.$queryRaw`
      SELECT email, code, expires_at, verified, user_data 
      FROM email_verifications 
      WHERE LOWER(email) = LOWER(${String(email)}) 
      LIMIT 1
    `
    const pending = pendingRows && pendingRows.length ? pendingRows[0] : null

    if (pending && !pending.verified) {
      // This is a pending registration - verify code and create account
      if (pending.code !== String(verificationCode)) {
        return NextResponse.json(
          { error: 'Invalid verification code' },
          { status: 400 }
        )
      }

      if (new Date(pending.expires_at) < new Date()) {
        return NextResponse.json(
          { error: 'Verification code has expired. Please request a new one.' },
          { status: 400 }
        )
      }

      // Parse user data from pending registration
      const userData = typeof pending.user_data === 'string' 
        ? JSON.parse(pending.user_data) 
        : pending.user_data

      // Create the actual user account
      const user = await prisma.user.create({
        data: {
          email: String(email).toLowerCase(),
          name: userData.name || '',
          phone: userData.phone || '',
          password: userData.passwordHash,
          emailVerified: true,
          verificationCode: null,
          verificationCodeExpiresAt: null,
        },
      })

      // Mark verification as complete
      await prisma.$executeRawUnsafe(
        `UPDATE email_verifications SET verified = true WHERE LOWER(email) = LOWER($1)`,
        String(email)
      )

      // Send welcome email
      try {
        await fetch(`${req.headers.get('origin')}/api/auth/send-welcome-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, name: user.name }),
        })
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError)
      }

      // Generate JWT token
      const secret = process.env.JWT_SECRET || 'dev-secret'
      const token = jwt.sign(
        { userId: user.id, role: user.role, email: user.email },
        secret,
        { expiresIn: '7d' }
      )

      const cookie = `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`

      return NextResponse.json(
        {
          ok: true,
          message: 'Email verified and account created successfully!',
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            emailVerified: user.emailVerified,
          },
          token,
        },
        { status: 200, headers: { 'Set-Cookie': cookie } }
      )
    }

    // Check if this is an existing user trying to verify
    const user = await prisma.user.findUnique({
      where: { email: String(email).toLowerCase() },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'No account found. Please sign up first.' },
        { status: 404 }
      )
    }

    // Validate verification code for existing user
    const validation = validateVerificationCode(
      String(verificationCode),
      user.verificationCode,
      user.verificationCodeExpiresAt
    )

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.message },
        { status: 400 }
      )
    }

    // Mark email as verified and clear verification code
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationCode: null,
        verificationCodeExpiresAt: null,
      },
    })

    // Generate a new token for the user
    const secret = process.env.JWT_SECRET || 'dev-secret'
    const token = jwt.sign(
      { userId: updatedUser.id, role: updatedUser.role, email: updatedUser.email },
      secret,
      { expiresIn: '7d' }
    )

    return NextResponse.json(
      {
        ok: true,
        message: 'Email verified successfully',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          emailVerified: updatedUser.emailVerified,
        },
        token,
      },
      { status: 200 }
    )
  } catch (e) {
    console.error('Error verifying email:', e)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')
    const code = searchParams.get('code')

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and code are required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: String(email).toLowerCase() },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Validate verification code
    const validation = validateVerificationCode(
      String(code),
      user.verificationCode,
      user.verificationCodeExpiresAt
    )

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.message },
        { status: 400 }
      )
    }

    // Mark email as verified and clear verification code
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationCode: null,
        verificationCodeExpiresAt: null,
      },
    })

    // Generate a new token for the user
    const secret = process.env.JWT_SECRET || 'dev-secret'
    const token = jwt.sign(
      { userId: updatedUser.id, role: updatedUser.role, email: updatedUser.email },
      secret,
      { expiresIn: '7d' }
    )

    return NextResponse.json(
      {
        ok: true,
        message: 'Email verified successfully',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          emailVerified: updatedUser.emailVerified,
        },
        token,
      },
      { status: 200 }
    )
  } catch (e) {
    console.error('Error verifying email:', e)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}
