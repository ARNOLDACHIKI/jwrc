import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password } = body || {}
    if (!email || !password) return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })

    // check exists
    const existing = await prisma.user.findFirst({ where: { email: { equals: String(email), mode: 'insensitive' } } })
    if (existing) return NextResponse.json({ error: 'User already exists' }, { status: 409 })

    const hash = await bcrypt.hash(String(password), 12)
    const user = await prisma.user.create({ data: { email: String(email), name: name ? String(name) : undefined, password: hash } })

    const secret = process.env.JWT_SECRET || 'dev-secret'
    const token = jwt.sign({ userId: user.id, role: user.role, email: user.email }, secret, { expiresIn: '7d' })
    const cookie = `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`

    return NextResponse.json({ ok: true }, { status: 201, headers: { 'Set-Cookie': cookie } })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
