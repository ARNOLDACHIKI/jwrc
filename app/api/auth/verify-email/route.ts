import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { validateVerificationCode } from "@/lib/verification"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

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
