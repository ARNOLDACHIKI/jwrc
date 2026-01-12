import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Normalize Gmail addresses - Gmail ignores dots before @
function normalizeGmail(email: string): string {
  const lowerEmail = email.toLowerCase()
  if (lowerEmail.includes('@gmail.com')) {
    const [localPart, domain] = lowerEmail.split('@')
    return localPart.replace(/\./g, '') + '@' + domain
  }
  return lowerEmail
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body
    if (!email || !password) return NextResponse.json({ error: "Missing credentials" }, { status: 400 })

    // try exact match first
    let user = await prisma.user.findUnique({ where: { email } })
    
    // If not found and it's a Gmail address, try normalizing and searching
    if (!user && email.toLowerCase().includes('@gmail.com')) {
      const normalized = normalizeGmail(email)
      // Try to find user by normalized email (without dots for Gmail)
      const allUsers = await prisma.user.findMany({
        where: {
          email: {
            contains: '@gmail.com',
            mode: 'insensitive'
          }
        }
      })
      // Find user where normalized emails match
      user = allUsers.find(u => normalizeGmail(u.email) === normalized) || null
    }
    
    // Fallback to case-insensitive search
    if (!user) {
      try {
        user = await prisma.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } })
      } catch (e) {
        // ignore and continue to return generic error
      }
    }
    if (!user) return NextResponse.json({ error: "No account found. Please register." }, { status: 404 })

    const valid = user.password ? await bcrypt.compare(password, user.password) : false
    if (!valid) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })

    const secret = process.env.JWT_SECRET || "dev-secret"
    const token = jwt.sign({ userId: user.id, role: user.role, email: user.email }, secret, { expiresIn: "7d" })

    // Set HttpOnly cookie (for backward compatibility)
    const cookie = `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`

    // Also return token in response body so client can store it in sessionStorage
    return NextResponse.json({ ok: true, token }, { status: 200, headers: { "Set-Cookie": cookie } })
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
