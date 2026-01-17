import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

function getTokenFromHeaders(req: Request) {
  const cookie = req.headers.get("cookie") || ""
  const match = cookie.split(";").map((c) => c.trim()).find((c) => c.startsWith("token="))
  if (!match) return null
  return match.split("=")[1]
}

export const dynamic = 'force-dynamic'


export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10))
    const pageSize = Math.max(1, Math.min(50, parseInt(url.searchParams.get('pageSize') || '10', 10)))
    const futureOnly = url.searchParams.get('futureOnly') === 'true'

    const where: any = {}
    if (futureOnly) {
      where.startsAt = { gte: new Date() }
    }

    const total = await prisma.event.count({ where })
    const items = await prisma.event.findMany({
      where,
      orderBy: { startsAt: 'asc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    })

    return NextResponse.json({ events: items, total, page, pageSize })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(req: Request) {
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
    
    // Verify user exists and check role from database (in case role was updated)
    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 })
    if (user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const { title, description, location, startsAt, endsAt } = body || {}
    const errors: Record<string, string> = {}
    if (!title || String(title).trim().length === 0) errors.title = 'Title is required'
    if (!startsAt) errors.startsAt = 'Start date/time is required'

    let parsedStarts: Date | null = null
    let parsedEnds: Date | null = null
    if (startsAt) {
      const p = Date.parse(startsAt)
      if (isNaN(p)) errors.startsAt = 'Start date/time is invalid'
      else parsedStarts = new Date(p)
    }
    if (endsAt) {
      const p2 = Date.parse(endsAt)
      if (isNaN(p2)) errors.endsAt = 'End date/time is invalid'
      else parsedEnds = new Date(p2)
    }

    if (parsedStarts && parsedEnds && parsedEnds < parsedStarts) errors.endsAt = 'End must be after start'

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 })
    }

    const created = await prisma.event.create({
      data: {
        title: String(title),
        description: description || '',
        location: location || '',
        startsAt: parsedStarts as Date,
        endsAt: parsedEnds || null,
      },
    })
    return NextResponse.json({ event: created }, { status: 201 })
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
    
    // Verify user exists and check role from database (in case role was updated)
    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 })
    if (user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const { id } = body || {}
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    try {
      const deleted = await prisma.event.delete({ where: { id } })
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
