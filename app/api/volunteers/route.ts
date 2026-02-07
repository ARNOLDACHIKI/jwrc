import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { randomUUID } from "crypto"
import jwt from "jsonwebtoken"
import { getVolunteerConfirmationEmail, getVolunteerAcceptanceEmail } from "@/lib/email-templates"
import { sendEmail } from "@/lib/send-email"

const prisma = new PrismaClient()

async function ensureTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS volunteer_applications (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      role_id TEXT,
      role_title TEXT,
      status TEXT DEFAULT 'pending',
      admin_message TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      responded_at TIMESTAMP WITH TIME ZONE
    )
  `)
  await prisma.$executeRawUnsafe(`ALTER TABLE volunteer_applications ADD COLUMN IF NOT EXISTS admin_message TEXT`)
}

function getTokenFromHeaders(req: Request) {
  const cookie = req.headers.get('cookie') || ''
  const match = cookie.split(';').map(c=>c.trim()).find(c=>c.startsWith('token='))
  if (!match) return null
  return match.split('=')[1]
}

export const dynamic = 'force-dynamic'


export async function POST(req: Request) {
  // public: submit volunteer application
  try {
    const body = await req.json()
    const { name, email, phone, roleId, roleTitle } = body || {}
    const errors: Record<string,string> = {}
    if (!name) errors.name = 'Name is required'
    if (!email) errors.email = 'Email is required'
    if (!roleId && !roleTitle) errors.role = 'Role is required'
    if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 400 })

    await ensureTable()
    const id = randomUUID()
    await prisma.$executeRawUnsafe(`INSERT INTO volunteer_applications (id, name, email, phone, role_id, role_title, status, created_at) VALUES ($1,$2,$3,$4,$5,$6,'pending',NOW())`, id, String(name), String(email), phone ? String(phone) : null, roleId ? String(roleId) : null, roleTitle ? String(roleTitle) : null)
    
    // Send professional confirmation email
    try {
      if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        try {
          const nodemailer = await import('nodemailer')
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            secure: (process.env.SMTP_SECURE === 'true'),
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
          })
          
          const emailContent = getVolunteerConfirmationEmail(
            String(name),
            roleTitle ? String(roleTitle) : roleId ? String(roleId) : 'Volunteer Position'
          )
          
          await transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: String(email),
            subject: emailContent.subject,
            html: emailContent.html,
            text: emailContent.text,
          })
        } catch (e) {
          console.warn('Failed to send confirmation email', e)
        }
      }
    } catch (e) {
      console.warn('Email send skipped', e)
    }
    
    return NextResponse.json({ application: { id, name, email, phone, roleId, roleTitle, status: 'pending' } }, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const forEmail = url.searchParams.get('email')
    const summary = url.searchParams.get('summary')
    // if email provided return applications for that email (public for user dashboard)
    await ensureTable()

    if (summary === 'roles') {
      const rows: any[] = await prisma.$queryRawUnsafe(
        `SELECT role_id as "roleId", role_title as "roleTitle", status, COUNT(*)::int as count FROM volunteer_applications GROUP BY role_id, role_title, status`
      )

      const aggregated: Record<string, any> = {}
      for (const row of rows) {
        const key = `${row.roleId ?? ''}|${row.roleTitle ?? ''}`
        if (!aggregated[key]) {
          aggregated[key] = {
            roleId: row.roleId || null,
            roleTitle: row.roleTitle || null,
            total: 0,
            approved: 0,
            pending: 0,
            rejected: 0,
          }
        }
        const bucket = aggregated[key]
        const count = typeof row.count === 'number' ? row.count : Number(row.count || 0)
        bucket.total += count
        if (row.status === 'approved') bucket.approved += count
        else if (row.status === 'pending') bucket.pending += count
        else if (row.status === 'rejected') bucket.rejected += count
      }

      return NextResponse.json({ roles: Object.values(aggregated) })
    }

    if (forEmail) {
      const rows: any[] = await prisma.$queryRawUnsafe(`SELECT id, name, email, phone, role_id as "roleId", role_title as "roleTitle", status, admin_message as "adminMessage", created_at as "createdAt", responded_at as "respondedAt" FROM volunteer_applications WHERE lower(email) = lower($1) ORDER BY created_at DESC`, forEmail)
      return NextResponse.json({ applications: rows })
    }

    // admin-only: list all
    const token = getTokenFromHeaders(req)
    const secret = process.env.JWT_SECRET || 'dev-secret'
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    let payload: any = null
    try { payload = jwt.verify(token, secret) } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
    if (payload.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const rows: any[] = await prisma.$queryRawUnsafe(`SELECT id, name, email, phone, role_id as "roleId", role_title as "roleTitle", status, admin_message as "adminMessage", created_at as "createdAt", responded_at as "respondedAt" FROM volunteer_applications ORDER BY created_at DESC`)
    return NextResponse.json({ applications: rows })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  // admin respond (approve/reject)
  try {
    const token = getTokenFromHeaders(req)
    const secret = process.env.JWT_SECRET || 'dev-secret'
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    let payload: any = null
    try { payload = jwt.verify(token, secret) } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
    if (payload.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const { id, action, message } = body || {}
    if (!id || !action) return NextResponse.json({ error: 'Missing id or action' }, { status: 400 })
    if (!['approve','reject'].includes(action)) return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

    await ensureTable()

    const appRow: any[] = await prisma.$queryRawUnsafe(`SELECT email, name, role_title FROM volunteer_applications WHERE id = $1`, id)
    const application = appRow && appRow[0] ? appRow[0] : null
    
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const status = action === 'approve' ? 'approved' : 'rejected'
    await prisma.$executeRawUnsafe(`UPDATE volunteer_applications SET status = $1, admin_message = $2, responded_at = NOW() WHERE id = $3`, status, message ? String(message) : null, id)

    // Keep user record aligned with volunteer decision
    if (application.email) {
      try {
        await prisma.user.updateMany({
          where: { email: { equals: String(application.email), mode: 'insensitive' } },
          data: { isVolunteer: status === 'approved' },
        })
      } catch (e) {
        console.warn('Failed to sync volunteer flag to user', e)
      }
    }

    // Send email notification when volunteer is accepted
    if (status === 'approved' && application.email && application.name && application.role_title) {
      try {
        const emailContent = getVolunteerAcceptanceEmail(
          application.name, 
          application.role_title, 
          message ? String(message) : undefined
        )
        await sendEmail(application.email, emailContent.subject, emailContent.html, emailContent.text)
      } catch (emailError) {
        console.error('Failed to send volunteer acceptance email:', emailError)
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const token = getTokenFromHeaders(req)
    const secret = process.env.JWT_SECRET || 'dev-secret'
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    let payload: any = null
    try { payload = jwt.verify(token, secret) } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
    if (payload.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const { id } = body || {}
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    await ensureTable()
    await prisma.$executeRawUnsafe(`DELETE FROM volunteer_applications WHERE id = $1`, String(id))

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
