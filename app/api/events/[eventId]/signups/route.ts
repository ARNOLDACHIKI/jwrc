import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

function getTokenFromHeaders(req: Request) {
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization")
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7)
  }
  const cookie = req.headers.get("cookie") || ""
  const match = cookie.split(";").map((c) => c.trim()).find((c) => c.startsWith("token="))
  if (!match) return null
  return match.split("=")[1]
}

export const dynamic = 'force-dynamic'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ eventId?: string }> }
) {
  try {
    const { eventId } = (await params) || {}
    if (!eventId) {
      return NextResponse.json({ error: 'Missing eventId' }, { status: 400 })
    }
    
    // Get token for verification
    const token = getTokenFromHeaders(req)
    const secret = process.env.JWT_SECRET || 'dev-secret'
    
    let userId: string | null = null
    let isAdmin = false
    if (token) {
      try {
        const payload = jwt.verify(token, secret) as any
        userId = payload.userId
        isAdmin = payload.role === 'admin'
      } catch (e) {
        // Not authenticated
      }
    }

    // Verify event exists
    const event = await prisma.event.findUnique({ where: { id: eventId } })
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Check global setting for attendee visibility
    let showAttendeesEnabled = true
    try {
      const settingsRows: any[] = await prisma.$queryRaw`SELECT show_event_attendees as "showEventAttendees" FROM church_settings WHERE id = 'main' LIMIT 1`
      showAttendeesEnabled = settingsRows && settingsRows.length ? (settingsRows[0].showEventAttendees !== false) : true
    } catch (e) {
      console.warn('Failed to read church_settings.show_event_attendees. Defaulting to true.', e)
      showAttendeesEnabled = true
    }

    // Check if attendees should be visible
    // Admins can always see, others need setting enabled + signup
    let canSeeAttendees = isAdmin
    
    if (!isAdmin && userId && showAttendeesEnabled) {
      // Check if user is signed up for this event
      const user = await prisma.user.findUnique({ where: { id: userId } })
      const userEmail = user?.email || ''
      if (userEmail) {
        const userSignup = await prisma.eventSignup.findFirst({
          where: {
            eventId,
            email: {
              equals: userEmail,
              mode: 'insensitive'
            }
          }
        })
        canSeeAttendees = !!userSignup
      }
    }

    // Fetch signups for this event
    const signups = await prisma.eventSignup.findMany({
      where: { eventId },
      orderBy: { createdAt: 'desc' }
    })

    // Only return signups if user can see attendees
    const rows = canSeeAttendees ? signups.map(s => ({
      id: s.id,
      ref: s.ref,
      eventId: s.eventId,
      name: s.name,
      email: isAdmin ? s.email : undefined,
      phone: isAdmin ? s.phone : undefined,
      createdAt: s.createdAt
    })) : []

    return NextResponse.json({ signups: rows })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
