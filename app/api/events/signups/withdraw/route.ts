import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

function getTokenFromRequest(req: Request): string | null {
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization")
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7)
  }
  
  const cookie = req.headers.get("cookie") || ""
  const match = cookie.split(";").map((c) => c.trim()).find((c) => c.startsWith("token="))
  if (match) {
    return match.split("=")[1]
  }
  
  return null
}

export async function POST(req: Request) {
  try {
    const token = getTokenFromRequest(req)
    
    if (!token) {
      return NextResponse.json({ 
        error: 'You must be logged in to withdraw from an event'
      }, { status: 401 })
    }

    const secret = process.env.JWT_SECRET || "dev-secret"
    let payload: any = null
    try {
      payload = jwt.verify(token, secret)
    } catch (e) {
      return NextResponse.json({ 
        error: 'Invalid authentication token'
      }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user) {
      return NextResponse.json({ 
        error: 'User not found'
      }, { status: 401 })
    }

    const { signupId } = await req.json()

    if (!signupId) {
      return NextResponse.json({ 
        error: 'Signup ID is required' 
      }, { status: 400 })
    }

    // Verify the signup belongs to the current user
    const signup: any[] = await prisma.$queryRawUnsafe(
      `SELECT id, email, event_id FROM event_signups WHERE id = $1 LIMIT 1`,
      signupId
    )

    if (!Array.isArray(signup) || signup.length === 0) {
      return NextResponse.json({ 
        error: 'Registration not found' 
      }, { status: 404 })
    }

    if (signup[0].email !== user.email) {
      return NextResponse.json({ 
        error: 'You can only withdraw your own registrations' 
      }, { status: 403 })
    }

    // Delete the signup
    await prisma.$queryRawUnsafe(
      `DELETE FROM event_signups WHERE id = $1`,
      signupId
    )

    return NextResponse.json({ 
      success: true,
      message: 'Successfully withdrawn from event'
    })
  } catch (error) {
    console.error("Error withdrawing from event:", error)
    return NextResponse.json(
      { error: "Failed to withdraw from event" },
      { status: 500 }
    )
  }
}
