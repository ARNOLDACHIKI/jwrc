import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

function getTokenFromRequest(req: Request): string | null {
  // First try to get token from Authorization header
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization")
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7)
  }
  
  // Fallback to cookie
  const cookie = req.headers.get("cookie") || ""
  const match = cookie.split(";").map((c) => c.trim()).find((c) => c.startsWith("token="))
  if (match) {
    return match.split("=")[1]
  }
  
  return null
}

export async function GET(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const eventId = params.eventId

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 })
    }

    // Get the current user from JWT token
    const token = getTokenFromRequest(req)
    
    if (!token) {
      return NextResponse.json({ 
        error: 'You must be logged in to view attendees',
        requiresAuth: true 
      }, { status: 401 })
    }

    const secret = process.env.JWT_SECRET || "dev-secret"
    let payload: any = null
    try {
      payload = jwt.verify(token, secret)
    } catch (e) {
      return NextResponse.json({ 
        error: 'Invalid authentication token',
        requiresAuth: true 
      }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user) {
      return NextResponse.json({ 
        error: 'User not found',
        requiresAuth: true 
      }, { status: 401 })
    }

    // Check if the user is registered for this event
    const userSignup: any[] = await prisma.$queryRawUnsafe(
      `SELECT id FROM event_signups WHERE event_id = $1 AND email = $2 LIMIT 1`,
      eventId,
      user.email
    )

    if (!Array.isArray(userSignup) || userSignup.length === 0) {
      return NextResponse.json({ 
        error: 'You must register for this event to view the attendee list',
        requiresRegistration: true 
      }, { status: 403 })
    }

    // Get all attendees for this event
    const attendees: any[] = await prisma.$queryRawUnsafe(
      `SELECT id, name, email, created_at, user_id 
       FROM event_signups 
       WHERE event_id = $1 
       ORDER BY created_at ASC`,
      eventId
    )

    // Get user profiles for attendees that have user_id
    const attendeesWithProfiles = await Promise.all(
      attendees.map(async (attendee) => {
        if (attendee.user_id) {
          const user = await prisma.user.findUnique({
            where: { id: attendee.user_id },
            select: { name: true, profileImage: true }
          })
          return {
            id: attendee.id,
            name: attendee.name || user?.name || 'Unknown',
            createdAt: attendee.created_at,
            image: user?.profileImage
          }
        }
        return {
          id: attendee.id,
          name: attendee.name || 'Unknown',
          createdAt: attendee.created_at,
          image: null
        }
      })
    )

    return NextResponse.json({
      attendees: attendeesWithProfiles,
      total: attendeesWithProfiles.length
    })
  } catch (error) {
    console.error("Error fetching attendees:", error)
    return NextResponse.json(
      { error: "Failed to fetch attendees" },
      { status: 500 }
    )
  }
}
