import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

function getTokenFromHeaders(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  const cookie = req.headers.get('cookie') || ''
  const match = cookie.split(';').map((c) => c.trim()).find((c) => c.startsWith('token='))
  if (!match) return null
  return match.split('=')[1]
}

export async function GET(req: NextRequest) {
  try {
    // Admin only
    const token = getTokenFromHeaders(req)
    const secret = process.env.JWT_SECRET || 'dev-secret'
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let payload: any
    try {
      payload = jwt.verify(token, secret)
    } catch (e) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const searchParams = req.nextUrl.searchParams
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json({ error: 'Search query required' }, { status: 400 })
    }

    // Search in EventSignup table
    const searchQuery = `%${query.toLowerCase()}%`
    
    const signups: any[] = await prisma.$queryRawUnsafe(`
      SELECT 
        es.id,
        es.ref,
        es.name,
        es.email,
        es.phone,
        es."createdAt" as "createdAt",
        e.id as event_id,
        e.title as event_title,
        e."startsAt" as event_starts_at,
        e.location as event_location
      FROM "EventSignup" es
      JOIN "Event" e ON es."eventId" = e.id
      WHERE 
        LOWER(es.name) LIKE $1 OR
        LOWER(es.email) LIKE $1 OR
        LOWER(es.phone) LIKE $1 OR
        LOWER(es.ref) LIKE $1
      LIMIT 1
    `, searchQuery)

    if (!signups || signups.length === 0) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    const signup = signups[0]

    // Try to get user profile image
    const user = await prisma.user.findFirst({
      where: { email: signup.email },
      select: { profileImage: true }
    })

    const ticket = {
      id: signup.id,
      ref: signup.ref,
      name: signup.name,
      email: signup.email,
      phone: signup.phone,
      profileImage: user?.profileImage,
      createdAt: signup.createdAt,
      checkedIn: signup.checkedIn || false,
      event: {
        id: signup.event_id,
        title: signup.event_title,
        startsAt: signup.event_starts_at,
        location: signup.event_location
      }
    }

    return NextResponse.json({ ticket })
  } catch (error) {
    console.error('Error searching ticket:', error)
    return NextResponse.json(
      { error: 'Failed to search ticket' },
      { status: 500 }
    )
  }
}
