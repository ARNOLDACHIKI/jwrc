import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all weekly programs
export async function GET() {
  try {
    const programs = await prisma.weeklyProgram.findMany({
      orderBy: { createdAt: 'desc' }
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

// POST create new weekly program
export async function POST(req: NextRequest) {
  try {
    const { name, day, time } = await req.json();
    
    if (!name || !day || !time) {
      return NextResponse.json(
        { error: 'Name, day, and time are required' },
        { status: 400 }
      );
    }

    const program = await prisma.weeklyProgram.create({
      data: {
        name,
        day,
        time,
        isActive: true
      }
    });

    return NextResponse.json(program, { status: 201 });
  } catch (error) {
    console.error('Error creating weekly program:', error);
    return NextResponse.json(
      { error: 'Failed to create weekly program' },
      { status: 500 }
    );
  }
}
