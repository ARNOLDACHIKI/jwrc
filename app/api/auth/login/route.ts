import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body
    if (!email || !password) return NextResponse.json({ error: "Missing credentials" }, { status: 400 })

    // try exact match first, then fallback to case-insensitive search
    let user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      try {
        user = await prisma.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } })
      } catch (e) {
        // ignore and continue to return generic error
      }
    }
    if (!user) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })

    const valid = user.password ? await bcrypt.compare(password, user.password) : false
    if (!valid) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })

    const secret = process.env.JWT_SECRET || "dev-secret"
    const token = jwt.sign({ userId: user.id, role: user.role, email: user.email }, secret, { expiresIn: "7d" })

    // Set HttpOnly cookie
    const cookie = `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`

    return NextResponse.json({ ok: true }, { status: 200, headers: { "Set-Cookie": cookie } })
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
