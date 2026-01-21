import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all active weekly programs
export async function GET() {
  try {
    const programs = await prisma.weeklyProgram.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' }
    });
    return NextResponse.json(programs);
  } catch (error) {
    console.error('Error fetching weekly programs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weekly programs' },
      { status: 500 }
    );
  }
}
