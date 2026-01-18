import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { getEmailVerificationEmail } from "@/lib/email-templates"

export const dynamic = 'force-dynamic'


export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, name, verificationCode } = body || {}

    console.log('📧 Verification email request:', { email, name, hasCode: !!verificationCode })

    if (!email || !verificationCode) {
      return NextResponse.json({ error: 'Email and verification code are required' }, { status: 400 })
    }

    let transporter

    console.log('🔧 SMTP Config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER ? process.env.SMTP_USER.substring(0, 5) + '...' : 'not set',
      secure: process.env.SMTP_SECURE,
    })

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      // Production email configuration
      console.log('✅ Using Gmail SMTP')
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
      console.log('⚠️ Using Ethereal test account (development)')
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
    console.log('📤 Sending email to:', email)
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Church Community" <noreply@church.org>',
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    })

    console.log('✅ Email sent successfully:', info.messageId)

    // Log preview URL if using Ethereal (development)
    if (process.env.NODE_ENV === 'development' && !process.env.SMTP_HOST) {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info))
    }

    return NextResponse.json({ ok: true, messageId: info.messageId }, { status: 200 })
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e)
    const errorCode = e instanceof Error && 'code' in e ? (e as any).code : 'UNKNOWN'
    
    console.error('❌ Error sending verification email:', errorMessage)
    console.error('Error code:', errorCode)
    
    // Log specific SMTP errors
    if (errorCode === 'EAUTH') {
      console.error('⚠️ SMTP Authentication failed - check SMTP_USER and SMTP_PASS')
    } else if (errorCode === 'ENOTFOUND') {
      console.error('⚠️ SMTP host not found - check SMTP_HOST')
    } else if (errorCode === 'ETIMEDOUT') {
      console.error('⚠️ SMTP connection timeout - check firewall/network')
    } else if (errorCode === 'EHOSTUNREACH') {
      console.error('⚠️ SMTP host unreachable - check SMTP_HOST and SMTP_PORT')
    }
    
    console.error('Full error:', e)
    
    return NextResponse.json({ 
      error: 'Failed to send verification email', 
      details: errorMessage,
      errorCode: errorCode
    }, { status: 500 })
  }
}
