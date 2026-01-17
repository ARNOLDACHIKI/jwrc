import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

function getTokenFromRequest(req: Request): string | null {
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization")
  if (authHeader && authHeader.startsWith("Bearer ")) return authHeader.substring(7)

  const cookie = req.headers.get("cookie") || ""
  const match = cookie.split(";").map((c) => c.trim()).find((c) => c.startsWith("token="))
  return match ? match.split("=")[1] : null
}

function mapUser(user: any) {
  if (!user) return null
  return {
    id: user.id,
    name: user.name || "",
    email: user.email,
    role: user.role,
    phone: user.phone || "",
    location: user.location || "",
    bio: user.bio || "",
    profileImage: user.profileImage || "",
    isVolunteer: !!user.isVolunteer,
    createdAt: user.createdAt,
  }
}

async function getAuthenticatedUser(req: Request) {
  const token = getTokenFromRequest(req)
  if (!token) return null
  const secret = process.env.JWT_SECRET || "dev-secret"
  try {
    const payload: any = jwt.verify(token, secret)
    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    return user ? { db: user, payload } : null
  } catch (e) {
    return null
  }
}

export const dynamic = 'force-dynamic'


export async function GET(req: Request) {
  try {
    const auth = await getAuthenticatedUser(req)
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    return NextResponse.json({ user: mapUser(auth.db) })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const auth = await getAuthenticatedUser(req)
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json().catch(() => ({}))
    const updates: Record<string, any> = {}
    const { name, email, phone, location, bio, profileImage } = body || {}

    if (typeof name === "string") updates.name = name.trim()
    if (typeof email === "string") updates.email = email.trim().toLowerCase()
    if (typeof phone === "string") updates.phone = phone.trim()
    if (typeof location === "string") updates.location = location.trim()
    if (typeof bio === "string") updates.bio = bio.trim()
    if (typeof profileImage === "string") updates.profileImage = profileImage.trim()

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No updates provided" }, { status: 400 })
    }

    // Enforce email uniqueness when changed
    if (updates.email && updates.email !== auth.db.email) {
      const existing = await prisma.user.findFirst({ where: { email: { equals: updates.email, mode: "insensitive" } } })
      if (existing && existing.id !== auth.db.id) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 })
      }
    }

    const updated = await prisma.user.update({ where: { id: auth.db.id }, data: updates })

    // Keep volunteer applications tied to the new email if email changed
    if (updates.email && updates.email !== auth.db.email) {
      try {
        await prisma.$executeRawUnsafe(
          `UPDATE volunteer_applications SET email = $1 WHERE LOWER(email) = LOWER($2)`,
          String(updates.email),
          String(auth.db.email),
        )
      } catch (e) {
        console.warn("Failed to sync volunteer applications email", e)
      }
    }

    // Refresh token so payload email stays in sync
    const secret = process.env.JWT_SECRET || "dev-secret"
    const token = jwt.sign({ userId: updated.id, role: updated.role, email: updated.email }, secret, { expiresIn: "7d" })
    const cookie = `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`

    return NextResponse.json({ user: mapUser(updated), token }, { headers: { "Set-Cookie": cookie } })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const auth = await getAuthenticatedUser(req)
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const userId = auth.db.id
    const userEmail = auth.db.email

    // Delete user's related data first (cascade)
    await prisma.$transaction(async (tx) => {
      // Delete volunteer applications
      await tx.$executeRawUnsafe(
        `DELETE FROM volunteer_applications WHERE LOWER(email) = LOWER($1)`,
        String(userEmail)
      )
      
      // Delete event signups
      await tx.$executeRawUnsafe(
        `DELETE FROM event_signups WHERE LOWER(email) = LOWER($1)`,
        String(userEmail)
      )
      
      // Delete password reset tokens
      await tx.$executeRawUnsafe(
        `DELETE FROM password_reset_tokens WHERE user_id = $1`,
        String(userId)
      )
      
      // Delete email verification codes
      await tx.$executeRawUnsafe(
        `DELETE FROM email_verifications WHERE LOWER(email) = LOWER($1)`,
        String(userEmail)
      )
      
      // Finally delete the user account
      await tx.user.delete({ where: { id: userId } })
    })

    // Clear auth cookie
    const clearCookie = `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`

    return NextResponse.json(
      { ok: true, message: "Account deleted successfully" },
      { headers: { "Set-Cookie": clearCookie } }
    )
  } catch (e) {
    console.error("Delete account error:", e)
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
