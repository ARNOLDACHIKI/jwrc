import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

function getTokenFromHeaders(req: Request) {
  const cookie = req.headers.get('cookie') || ''
  const match = cookie.split(';').map(c=>c.trim()).find(c=>c.startsWith('token='))
  if (!match) return null
  return match.split('=')[1]
}

export const dynamic = 'force-dynamic'

// Get trashed items
export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromHeaders(req)
    const secret = process.env.JWT_SECRET || 'dev-secret'
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    let payload: any = null
    try { payload = jwt.verify(token, secret) } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
    if (payload.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') || 'all' // 'all', 'volunteers', 'suggestions', 'tickets'
    const items: any[] = []

    if (type === 'all' || type === 'volunteers') {
      const volunteers = await prisma.$queryRawUnsafe(
        `SELECT id, name, email, phone, role_id as "roleId", role_title as "roleTitle", status, admin_message as "adminMessage", created_at as "createdAt", deleted_at as "deletedAt" FROM volunteer_applications WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC`
      )
      items.push(...(volunteers as any[]).map(v => ({ ...v, type: 'volunteer' })))
    }

    if (type === 'all' || type === 'suggestions') {
      const suggestions = await prisma.$queryRawUnsafe(
        `SELECT id, name, email, type, message, admin_response as "adminResponse", responder_name as "responderName", created_at as "createdAt", responded_at as "respondedAt", deleted_at as "deletedAt" FROM suggestions WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC`
      )
      items.push(...(suggestions as any[]).map(s => ({ ...s, type: 'suggestion' })))
    }

    if (type === 'all' || type === 'tickets') {
      const tickets = await prisma.$queryRawUnsafe(`
        SELECT 
          s.id, 
          s."eventId" as "eventId", 
          s.ref, 
          s.name, 
          s.email, 
          s.phone, 
          s."createdAt" as "createdAt",
          s."deletedAt" as "deletedAt",
          e.title as "eventTitle",
          e."startsAt" as "eventDate",
          e.location as "eventLocation"
        FROM "EventSignup" s
        LEFT JOIN "Event" e ON s."eventId" = e.id
        WHERE s."deletedAt" IS NOT NULL
        ORDER BY s."deletedAt" DESC
      `)
      items.push(...(tickets as any[]).map(t => ({ ...t, type: 'ticket' })))
    }

    return NextResponse.json({ items })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// Restore items from trash
export async function PATCH(req: NextRequest) {
  try {
    const token = getTokenFromHeaders(req)
    const secret = process.env.JWT_SECRET || 'dev-secret'
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    let payload: any = null
    try { payload = jwt.verify(token, secret) } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
    if (payload.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const { ids = [], type } = body || {}
    if (ids.length === 0 || !type) return NextResponse.json({ error: 'Missing ids or type' }, { status: 400 })

    if (type === 'volunteers') {
      for (const id of ids) {
        await prisma.$executeRawUnsafe(`UPDATE volunteer_applications SET deleted_at = NULL WHERE id = $1`, String(id))
      }
    } else if (type === 'suggestions') {
      for (const id of ids) {
        await prisma.$executeRawUnsafe(`UPDATE suggestions SET deleted_at = NULL WHERE id = $1`, String(id))
      }
    } else if (type === 'tickets') {
      for (const id of ids) {
        await prisma.$executeRawUnsafe(`UPDATE "EventSignup" SET "deletedAt" = NULL WHERE id = $1`, String(id))
      }
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// Permanently delete from trash
export async function DELETE(req: NextRequest) {
  try {
    const token = getTokenFromHeaders(req)
    const secret = process.env.JWT_SECRET || 'dev-secret'
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    let payload: any = null
    try { payload = jwt.verify(token, secret) } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
    if (payload.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const { ids = [], type } = body || {}
    if (ids.length === 0 || !type) return NextResponse.json({ error: 'Missing ids or type' }, { status: 400 })

    if (type === 'volunteers') {
      for (const id of ids) {
        await prisma.$executeRawUnsafe(`DELETE FROM volunteer_applications WHERE id = $1 AND deleted_at IS NOT NULL`, String(id))
      }
    } else if (type === 'suggestions') {
      for (const id of ids) {
        await prisma.$executeRawUnsafe(`DELETE FROM suggestions WHERE id = $1 AND deleted_at IS NOT NULL`, String(id))
      }
    } else if (type === 'tickets') {
      for (const id of ids) {
        await prisma.$executeRawUnsafe(`DELETE FROM "EventSignup" WHERE id = $1 AND "deletedAt" IS NOT NULL`, String(id))
      }
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
