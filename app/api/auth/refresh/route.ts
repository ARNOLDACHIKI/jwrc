import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || ""
    const match = cookie.split(";").map((c) => c.trim()).find((c) => c.startsWith("token="))
    if (!match) return NextResponse.json({ error: 'Not logged in' }, { status: 401 })
    
    const token = match.split("=")[1]
    const secret = process.env.JWT_SECRET || "dev-secret"
    
    let payload: any = null
    try {
      payload = jwt.verify(token, secret)
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Fetch fresh user data from database
    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Generate new token with current database role
    const newToken = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      secret,
      { expiresIn: "7d" }
    )

    // Set new HttpOnly cookie
    const cookieHeader = `token=${newToken}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`

    return NextResponse.json(
      { ok: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } },
      { status: 200, headers: { "Set-Cookie": cookieHeader } }
    )
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
