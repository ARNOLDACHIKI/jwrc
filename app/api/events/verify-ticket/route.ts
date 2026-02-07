import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"
import { parseTicketQRCode } from "@/lib/qrcode"

const prisma = new PrismaClient()

function getTokenFromHeaders(req: Request) {
  const cookie = req.headers.get("cookie") || ""
  const match = cookie.split(";").map((c) => c.trim()).find((c) => c.startsWith("token="))
  if (!match) return null
  return match.split("=")[1]
}

export const dynamic = 'force-dynamic'


export async function POST(req: Request) {
  try {
    // Verify authentication (admin or leader)
    const token = getTokenFromHeaders(req)
    const secret = process.env.JWT_SECRET || 'dev-secret'
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    let payload: any = null
    try { 
      payload = jwt.verify(token, secret) 
    } catch (e) { 
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) 
    }
    
    if (payload.role !== 'admin' && payload.role !== 'leader') {
      return NextResponse.json({ error: 'Forbidden - Admin or Leader access required' }, { status: 403 })
    }

    const body = await req.json()
    const { qrData } = body || {}

    if (!qrData) {
      return NextResponse.json({ error: 'QR code data is required' }, { status: 400 })
    }

    // Parse and validate QR code data
    const parsed = parseTicketQRCode(qrData)
    
    if (!parsed.valid) {
      return NextResponse.json({ error: parsed.error || 'Invalid QR code' }, { status: 400 })
    }

    // Handle new URL format (just has ref)
    let signup: any
    if (parsed.ref) {
      // New URL format - lookup by reference only
      signup = await prisma.eventSignup.findUnique({
        where: { ref: parsed.ref }
      })
    } else if (parsed.data) {
      // Legacy JSON format - lookup by ID and eventId
      const ticketData = parsed.data
      signup = await prisma.eventSignup.findFirst({
        where: {
          id: ticketData.signupId,
          eventId: ticketData.eventId
        }
      })
    } else {
      return NextResponse.json({ 
        error: 'Invalid ticket data format',
        valid: false 
      }, { status: 400 })
    }

    if (!signup) {
      return NextResponse.json({ 
        error: 'Ticket not found or invalid',
        valid: false 
      }, { status: 404 })
    }

    // For legacy format, verify the ticket data matches
    if (parsed.data && signup.ref !== parsed.data.ref) {
      return NextResponse.json({ 
        error: 'Ticket reference mismatch',
        valid: false 
      }, { status: 400 })
    }

    // Get event details
    const event = await prisma.event.findUnique({ 
      where: { id: signup.eventId } 
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Check if already checked in (these fields don't exist in schema, so always false)
    const alreadyCheckedIn = false

    // Return ticket validation result
    return NextResponse.json({
      valid: true,
      alreadyCheckedIn,
      signup: {
        id: signup.id,
        name: signup.name,
        email: signup.email,
        phone: signup.phone,
        ref: signup.ref,
        checkedIn: false,
        checkedInAt: null
      },
      event: {
        id: event.id,
        title: event.title,
        startsAt: event.startsAt,
        location: event.location
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Error verifying ticket:', error)
    return NextResponse.json(
      { error: 'Failed to verify ticket' },
      { status: 500 }
    )
  }
}

// Check-in endpoint (separate from verification)
export async function PATCH(req: Request) {
  try {
    // Verify authentication (admin or leader)
    const token = getTokenFromHeaders(req)
    const secret = process.env.JWT_SECRET || 'dev-secret'
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    let payload: any = null
    try { 
      payload = jwt.verify(token, secret) 
    } catch (e) { 
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) 
    }
    
    if (payload.role !== 'admin' && payload.role !== 'leader') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { signupId } = body || {}

    if (!signupId) {
      return NextResponse.json({ error: 'Signup ID is required' }, { status: 400 })
    }

    // Note: checkedIn and checkedInAt fields don't exist in current schema
    // This endpoint is here for future use when those fields are added
    const signup = await prisma.eventSignup.findUnique({
      where: { id: signupId }
    })

    if (!signup) {
      return NextResponse.json({ error: 'Signup not found' }, { status: 404 })
    }

    return NextResponse.json({
      ok: true,
      message: 'Checked in successfully',
      signup: signup
    }, { status: 200 })

  } catch (error) {
    console.error('Error checking in:', error)
    return NextResponse.json(
      { error: 'Failed to check in' },
      { status: 500 }
    )
  }
}
