import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, name } = body || {}

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Create a test account if no SMTP credentials are configured
    let transporter
    
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      // Production email configuration
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
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
    
    // Send email
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Church Community" <noreply@church.org>',
      to: email,
      subject: 'Welcome to Our Church Community! 🙏',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 10px 10px 0 0;
              text-align: center;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background: #667eea;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Welcome to Our Community!</h1>
          </div>
          <div class="content">
            <h2>Hello ${displayName}! 👋</h2>
            <p>Thank you for registering with our church community. We're thrilled to have you join us!</p>
            
            <p>Your account has been successfully created. You can now:</p>
            <ul>
              <li>View upcoming events and register to attend</li>
              <li>Read our latest sermons and announcements</li>
              <li>Make donations to support our mission</li>
              <li>Sign up to volunteer for various activities</li>
              <li>Participate in our community programs</li>
            </ul>

            <p>We're here to support you on your spiritual journey and help you connect with our community.</p>
            
            <div style="background: #fff; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; font-style: italic;">
              <p style="margin: 0; color: #555; font-size: 15px;">
                "Yet a time is coming and has now come when the true worshipers will worship the Father in the Spirit and in truth, for they are the kind of worshipers the Father seeks."
              </p>
              <p style="margin: 10px 0 0 0; color: #667eea; font-weight: bold; text-align: right;">
                - John 4:23
              </p>
            </div>
            
            <center>
              <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/dashboard" class="button">
                Go to Dashboard
              </a>
            </center>

            <p>If you have any questions or need assistance, please don't hesitate to reach out to us.</p>
            
            <p>Blessings,<br>
            <strong>The Church Community Team</strong></p>
          </div>
          <div class="footer">
            <p>This email was sent because you registered an account with us.</p>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to Our Church Community!
        
        Hello ${displayName}!
        
        Thank you for registering with our church community. We're thrilled to have you join us!
        
        Your account has been successfully created. You can now:
        - View upcoming events and register to attend
        - Read our latest sermons and announcements
        - Make donations to support our mission
        - Sign up to volunteer for various activities
        - Participate in our community programs
        
        We're here to support you on your spiritual journey and help you connect with our community.
        
        "Yet a time is coming and has now come when the true worshipers will worship the Father in the Spirit and in truth, for they are the kind of worshipers the Father seeks." - John 4:23
        
        Visit your dashboard: ${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/dashboard
        
        If you have any questions or need assistance, please don't hesitate to reach out to us.
        
        Blessings,
        The Church Community Team
      `,
    })

    // If using Ethereal (development), log the preview URL
    if (!process.env.SMTP_HOST) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
    }

    return NextResponse.json({ 
      success: true, 
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info) || undefined
    })
  } catch (error) {
    console.error('Email sending error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
