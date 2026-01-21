import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PATCH update weekly program
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, day, time, isActive } = await req.json();
    const { id } = params;

    const program = await prisma.weeklyProgram.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(day !== undefined && { day }),
        ...(time !== undefined && { time }),
        ...(isActive !== undefined && { isActive })
      }
    });

    return NextResponse.json(program);
  } catch (error) {
    console.error('Error updating weekly program:', error);
    return NextResponse.json(
      { error: 'Failed to update weekly program' },
      { status: 500 }
    );
  }
}

// DELETE weekly program
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.weeklyProgram.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting weekly program:', error);
    return NextResponse.json(
      { error: 'Failed to delete weekly program' },
      { status: 500 }
    );
  }
}
