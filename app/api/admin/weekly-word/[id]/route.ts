import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

function getTokenFromHeaders(req: NextRequest) {
  const cookie = req.headers.get('cookie') || '';
  const match = cookie
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith('token='));
  if (!match) return null;
  return match.split('=')[1];
}

// PATCH update weekly word
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin auth
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

    const { title, theme, scripture, content, weekStart, isActive } = await req.json();
    const { id } = await params;

    // If activating this word, deactivate all others first
    if (isActive === true) {
      await prisma.weeklyWord.updateMany({
        where: {
          id: { not: id }
        },
        data: {
          isActive: false
        }
      });
    }

    const word = await prisma.weeklyWord.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(theme !== undefined && { theme }),
        ...(scripture !== undefined && { scripture }),
        ...(content !== undefined && { content }),
        ...(weekStart !== undefined && { weekStart: new Date(weekStart) }),
        ...(isActive !== undefined && { isActive })
      }
    });

    return NextResponse.json(word);
  } catch (error) {
    console.error('Error updating weekly word:', error);
    return NextResponse.json(
      { error: 'Failed to update weekly word' },
      { status: 500 }
    );
  }
}

// DELETE weekly word
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin auth
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

    const { id } = await params;
    await prisma.weeklyWord.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting weekly word:', error);
    return NextResponse.json(
      { error: 'Failed to delete weekly word' },
      { status: 500 }
    );
  }
}
