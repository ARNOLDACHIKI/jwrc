import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { sendVerificationEmail } from '@/lib/send-email'

const prisma = new PrismaClient()

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function getVerificationCodeExpiration() {
  const expiresAt = new Date()
  expiresAt.setMinutes(expiresAt.getMinutes() + 15)
  return expiresAt
}

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email } = body || {}

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Check if there's a pending verification
    const pending: any[] = await prisma.$queryRawUnsafe(
      `SELECT email, user_data FROM email_verifications WHERE LOWER(email) = LOWER($1) AND verified = false`,
      String(email).toLowerCase()
    )

    if (!pending || pending.length === 0) {
      return NextResponse.json({ error: 'No pending verification found for this email' }, { status: 404 })
    }

    // Generate new code
    const newCode = generateVerificationCode()
    const newExpiration = getVerificationCodeExpiration()

    // Update the verification code
    await prisma.$executeRawUnsafe(
      `UPDATE email_verifications SET code = $1, expires_at = $2 WHERE LOWER(email) = LOWER($3)`,
      newCode,
      newExpiration,
      String(email).toLowerCase()
    )

    // Get user data for name
    const userData = pending[0].user_data
    const name = userData?.name || 'User'

    // Send new verification email
    try {
      const emailResult = await sendVerificationEmail(String(email), name, newCode)
      if (!emailResult.success) {
        console.error('Failed to resend verification email:', emailResult.error)
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
      }
    } catch (emailError) {
      console.error('Failed to resend verification email:', emailError)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      message: 'Verification code resent successfully'
    }, { status: 200 })
  } catch (e) {
    console.error('Resend verification error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
