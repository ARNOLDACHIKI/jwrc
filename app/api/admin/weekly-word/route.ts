import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all weekly words
export async function GET() {
  try {
    const words = await prisma.weeklyWord.findMany({
      orderBy: { weekStart: 'desc' }
    });
    return NextResponse.json(words);
  } catch (error) {
    console.error('Error fetching weekly words:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weekly words' },
      { status: 500 }
    );
  }
}

// POST create new weekly word
export async function POST(req: NextRequest) {
  try {
    const { title, theme, scripture, content, weekStart } = await req.json();
    
    if (!title || !theme || !content || !weekStart) {
      return NextResponse.json(
        { error: 'Title, theme, content, and week start date are required' },
        { status: 400 }
      );
    }

    const word = await prisma.weeklyWord.create({
      data: {
        title,
        theme,
        scripture: scripture || null,
        content,
        weekStart: new Date(weekStart),
        isActive: true
      }
    });

    return NextResponse.json(word, { status: 201 });
  } catch (error) {
    console.error('Error creating weekly word:', error);
    return NextResponse.json(
      { error: 'Failed to create weekly word' },
      { status: 500 }
    );
  }
}
