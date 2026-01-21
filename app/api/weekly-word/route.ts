import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET active weekly word (current week)
export async function GET() {
  try {
    const now = new Date();
    
    // Find the most recent active word
    const word = await prisma.weeklyWord.findFirst({
      where: { 
        isActive: true,
        weekStart: {
          lte: now
        }
      },
      orderBy: { weekStart: 'desc' }
    });
    
    return NextResponse.json(word);
  } catch (error) {
    console.error('Error fetching weekly word:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weekly word' },
      { status: 500 }
    );
  }
}
