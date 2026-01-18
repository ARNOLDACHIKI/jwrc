import nodemailer from "nodemailer"
import { getEmailVerificationEmail } from "./email-templates"

export async function sendVerificationEmail(email: string, name: string, verificationCode: string) {
  try {
    console.log('📧 Sending verification email to:', email)

    let transporter

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
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

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Church Community" <noreply@church.org>',
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    })

    console.log('✅ Email sent successfully:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e)
    const errorCode = e instanceof Error && 'code' in e ? (e as any).code : 'UNKNOWN'
    
    console.error('❌ Error sending verification email:', errorMessage)
    console.error('Error code:', errorCode)
    
    if (errorCode === 'EAUTH') {
      console.error('⚠️ SMTP Authentication failed - check SMTP_USER and SMTP_PASS')
    } else if (errorCode === 'ENOTFOUND') {
      console.error('⚠️ SMTP host not found - check SMTP_HOST')
    } else if (errorCode === 'ETIMEDOUT') {
      console.error('⚠️ SMTP connection timeout - check firewall/network')
    } else if (errorCode === 'EHOSTUNREACH') {
      console.error('⚠️ SMTP host unreachable - check SMTP_HOST and SMTP_PORT')
    }
    
    return { success: false, error: errorMessage, errorCode }
  }
}
