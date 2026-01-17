import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

function getTokenFromHeaders(req: Request) {
  const cookie = req.headers.get('cookie') || ''
  const match = cookie.split(';').map(c=>c.trim()).find(c=>c.startsWith('token='))
  if (!match) return null
  return match.split('=')[1]
}

export const dynamic = 'force-dynamic'


export async function POST(req: Request) {
  try {
    const token = getTokenFromHeaders(req)
    const secret = process.env.JWT_SECRET || 'dev-secret'
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    let payload: any = null
    try { payload = jwt.verify(token, secret) } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
    if (payload.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const { email, newPassword } = body || {}
    if (!email || !newPassword) return NextResponse.json({ error: 'Email and newPassword required' }, { status: 400 })

    // find user
    let user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      try { user = await prisma.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } }) } catch (e) {}
    }
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const hash = await bcrypt.hash(String(newPassword), 12)
    await prisma.$executeRawUnsafe(`UPDATE "User" SET password = $1 WHERE id = $2`, hash, user.id)
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
