import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || ""
    const match = cookie.split(";").map((c) => c.trim()).find((c) => c.startsWith("token="))
    if (!match) return NextResponse.json({ user: null }, { status: 200 })
    const token = match.split("=")[1]
    const secret = process.env.JWT_SECRET || "dev-secret"
    let payload: any = null
    try {
      payload = jwt.verify(token, secret)
    } catch (e) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user) return NextResponse.json({ user: null }, { status: 200 })

    const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone }
    return NextResponse.json({ user: safeUser }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ user: null }, { status: 500 })
  }
}
