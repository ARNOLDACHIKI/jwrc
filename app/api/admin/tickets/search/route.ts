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

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const eventId = searchParams.get('eventId');

    let signups: any[] = [];

    if (eventId && query) {
      // Search within specific event
      signups = await prisma.$queryRawUnsafe(`
        SELECT 
          s.id, 
          s."eventId" as "eventId", 
          s.ref, 
          s.name, 
          s.email, 
          s.phone, 
          s."createdAt" as "createdAt",
          e.title as "eventTitle",
          e."startsAt" as "eventDate",
          e.location as "eventLocation"
        FROM "EventSignup" s
        LEFT JOIN "Event" e ON s."eventId" = e.id
        WHERE s."eventId" = $1::uuid 
        AND s."deletedAt" IS NULL
        AND (
          lower(s.name) LIKE lower($2) OR 
          lower(s.email) LIKE lower($2) OR 
          (s.phone IS NOT NULL AND s.phone LIKE $2) OR
          s.ref LIKE $2
        )
        ORDER BY s."createdAt" DESC
        LIMIT 50
      `, eventId, `%${query}%`);
    } else if (eventId) {
      // Get all signups for specific event (no search query)
      signups = await prisma.$queryRawUnsafe(`
        SELECT 
          s.id, 
          s."eventId" as "eventId", 
          s.ref, 
          s.name, 
          s.email, 
          s.phone, 
          s."createdAt" as "createdAt",
          e.title as "eventTitle",
          e."startsAt" as "eventDate",
          e.location as "eventLocation"
        FROM "EventSignup" s
        LEFT JOIN "Event" e ON s."eventId" = e.id
        WHERE s."eventId" = $1::uuid
        AND s."deletedAt" IS NULL
        ORDER BY s."createdAt" DESC
        LIMIT 100
      `, eventId);
    } else if (query) {
      // Search across all events
      signups = await prisma.$queryRawUnsafe(`
        SELECT 
          s.id, 
          s."eventId" as "eventId", 
          s.ref, 
          s.name, 
          s.email, 
          s.phone, 
          s."createdAt" as "createdAt",
          e.title as "eventTitle",
          e."startsAt" as "eventDate",
          e.location as "eventLocation"
        FROM "EventSignup" s
        LEFT JOIN "Event" e ON s."eventId" = e.id
        WHERE s."deletedAt" IS NULL
        AND (
          lower(s.name) LIKE lower($1) OR 
          lower(s.email) LIKE lower($1) OR 
          (s.phone IS NOT NULL AND s.phone LIKE $1) OR
          s.ref LIKE $1
        )
        ORDER BY s."createdAt" DESC
        LIMIT 50
      `, `%${query}%`);
    } else {
      // Get all signups (no filters) - only include signups where event still exists
      signups = await prisma.$queryRawUnsafe(`
        SELECT 
          s.id, 
          s."eventId" as "eventId", 
          s.ref, 
          s.name, 
          s.email, 
          s.phone, 
          s."createdAt" as "createdAt",
          e.title as "eventTitle",
          e."startsAt" as "eventDate",
          e.location as "eventLocation"
        FROM "EventSignup" s
        INNER JOIN "Event" e ON s."eventId" = e.id
        ORDER BY s."createdAt" DESC
        LIMIT 100
      `);
    }

    // Get user profile images for each signup
    const signupsWithImages = await Promise.all(
      signups.map(async (signup) => {
        const user = await prisma.user.findFirst({
          where: { email: signup.email },
          select: { profileImage: true }
        });
        return {
          ...signup,
          userImage: user?.profileImage || null
        };
      })
    );

    return NextResponse.json({ signups: signupsWithImages });
  } catch (error) {
    console.error('Error searching tickets:', error);
    return NextResponse.json({ error: 'Failed to search tickets' }, { status: 500 });
  }
}
