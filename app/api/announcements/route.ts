import { NextResponse } from "next/server"
import { prisma } from '@/lib/db'
import jwt from "jsonwebtoken"

function getTokenFromHeaders(req: Request) {
  const cookie = req.headers.get("cookie") || ""
  const match = cookie.split(";").map((c) => c.trim()).find((c) => c.startsWith("token="))
  if (!match) return null
  return match.split("=")[1]
}

export async function GET() {
  try {
    const items = await prisma.announcement.findMany({ orderBy: { postedAt: 'desc' } })
    return NextResponse.json({ announcements: items })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    // check admin
    const token = getTokenFromHeaders(req)
    const secret = process.env.JWT_SECRET || 'dev-secret'
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    let payload: any = null
    try {
      payload = jwt.verify(token, secret)
    } catch (e) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (payload.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const { title, content } = body
    if (!title || !content) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const created = await prisma.announcement.create({ data: { title, content, author: payload.email } })
    return NextResponse.json({ announcement: created }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const token = getTokenFromHeaders(req)
    const secret = process.env.JWT_SECRET || 'dev-secret'
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    let payload: any = null
    try {
      payload = jwt.verify(token, secret)
    } catch (e) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (payload.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const { id } = body || {}
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    try {
      const deleted = await prisma.announcement.delete({ where: { id } })
      return NextResponse.json({ deleted })
    } catch (e: any) {
      if (e.code === 'P2025') {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
      }
      return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
    }
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
