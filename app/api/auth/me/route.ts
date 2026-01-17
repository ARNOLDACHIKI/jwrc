import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

function getTokenFromRequest(req: Request): string | null {
  // First try to get token from Authorization header (for tab-specific sessions)
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization")
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7)
  }
  
  // Fallback to cookie (for backward compatibility)
  const cookie = req.headers.get("cookie") || ""
  const match = cookie.split(";").map((c) => c.trim()).find((c) => c.startsWith("token="))
  if (match) {
    return match.split("=")[1]
  }
  
  return null
}

export const dynamic = 'force-dynamic'


export async function GET(req: Request) {
  try {
    const token = getTokenFromRequest(req)
    if (!token) return NextResponse.json({ user: null }, { status: 200 })
    
    const secret = process.env.JWT_SECRET || "dev-secret"
    let payload: any = null
    try {
      payload = jwt.verify(token, secret)
    } catch (e) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user) return NextResponse.json({ user: null }, { status: 200 })

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      location: user.location,
      bio: user.bio,
      profileImage: user.profileImage,
      isVolunteer: user.isVolunteer,
      createdAt: user.createdAt,
    }

    return NextResponse.json({ user: safeUser }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ user: null }, { status: 500 })
  }
}
