import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function GET(
  req: Request,
  { params }: { params: { reference: string } }
) {
  try {
    const reference = params.reference

    if (!reference) {
      return NextResponse.json({ error: 'Reference is required' }, { status: 400 })
    }

    // Find signup by reference code
    const signupResult: any[] = await prisma.$queryRawUnsafe(
      `SELECT * FROM event_signups WHERE ref = $1 LIMIT 1`,
      reference
    )

    if (!Array.isArray(signupResult) || signupResult.length === 0) {
      return NextResponse.json({ 
        error: 'Ticket not found',
        found: false 
      }, { status: 404 })
    }

    const signup = signupResult[0]

    // Get event details
    const event = await prisma.event.findUnique({ 
      where: { id: signup.event_id } 
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Return ticket information
    return NextResponse.json({
      found: true,
      signup: {
        id: signup.id,
        name: signup.name,
        email: signup.email,
        phone: signup.phone,
        ref: signup.ref,
        checkedIn: signup.checked_in || false,
        checkedInAt: signup.checked_in_at,
        createdAt: signup.created_at
      },
      event: {
        id: event.id,
        title: event.title,
        description: event.description,
        startsAt: event.startsAt,
        endsAt: event.endsAt,
        location: event.location
      }
    })
  } catch (error) {
    console.error("Error fetching ticket:", error)
    return NextResponse.json(
      { error: "Failed to fetch ticket information" },
      { status: 500 }
    )
  }
}
