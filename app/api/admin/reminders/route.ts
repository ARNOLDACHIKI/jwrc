import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET all reminders (admin only)
export async function GET(request: NextRequest) {
  try {
    const reminders = await prisma.reminder.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(reminders)
  } catch (error) {
    console.error('Error fetching reminders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reminders' },
      { status: 500 }
    )
  }
}

// POST - Create new reminder (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, message, template, isActive } = body

    if (!title || !message) {
      return NextResponse.json(
        { error: 'Title and message are required' },
        { status: 400 }
      )
    }

    const reminder = await prisma.reminder.create({
      data: {
        title,
        message,
        template: template || 'custom',
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json(reminder, { status: 201 })
  } catch (error) {
    console.error('Error creating reminder:', error)
    return NextResponse.json(
      { error: 'Failed to create reminder' },
      { status: 500 }
    )
  }
}
