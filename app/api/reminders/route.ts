import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET active reminders (public - for displaying on website)
export async function GET(request: NextRequest) {
  try {
    const reminders = await prisma.reminder.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 1 // Only get the most recent active reminder
    })
    
    return NextResponse.json(reminders[0] || null)
  } catch (error) {
    console.error('Error fetching active reminder:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reminder' },
      { status: 500 }
    )
  }
}
