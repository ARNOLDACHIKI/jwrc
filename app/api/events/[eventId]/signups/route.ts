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

    // Fetch signups for this event - only return to admins
    if (!isAdmin) {
      return NextResponse.json({ signups: [] })
    }

    const signups = await prisma.eventSignup.findMany({
      where: { eventId },
      orderBy: { createdAt: 'desc' }
    })

    const rows = signups.map(s => ({
      id: s.id,
      ref: s.ref,
      eventId: s.eventId,
      name: s.name,
      email: s.email,
      phone: s.phone,
      createdAt: s.createdAt
    }))

    return NextResponse.json({ signups: rows })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
