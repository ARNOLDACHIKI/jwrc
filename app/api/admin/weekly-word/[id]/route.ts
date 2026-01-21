import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PATCH update weekly word
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { title, theme, scripture, content, weekStart, isActive } = await req.json();
    const { id } = params;

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
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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
