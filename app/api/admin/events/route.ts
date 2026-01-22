import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

function getTokenFromHeaders(req: Request) {
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.split(";").map((c) => c.trim()).find((c) => c.startsWith("token="));
  if (!match) return null;
  return match.split("=")[1];
}

export async function GET(req: NextRequest) {
  try {
    // Admin-only
    const token = getTokenFromHeaders(req);
    const secret = process.env.JWT_SECRET || 'dev-secret';
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    let payload: any = null;
    try {
      payload = jwt.verify(token, secret);
    } catch (e) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const events = await prisma.event.findMany({
      orderBy: { startsAt: 'desc' }
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
