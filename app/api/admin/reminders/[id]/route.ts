import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// PATCH - Update reminder (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, message, template, isActive } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Reminder ID is required' },
        { status: 400 }
      )
    }

    const reminder = await prisma.reminder.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(message && { message }),
        ...(template && { template }),
        ...(isActive !== undefined && { isActive })
      }
    })

    return NextResponse.json(reminder)
  } catch (error) {
    console.error('Error updating reminder:', error)
    return NextResponse.json(
      { error: 'Failed to update reminder' },
      { status: 500 }
    )
  }
}

// DELETE - Delete reminder (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Reminder ID is required' },
        { status: 400 }
      )
    }

    await prisma.reminder.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Reminder deleted successfully' })
  } catch (error) {
    console.error('Error deleting reminder:', error)
    return NextResponse.json(
      { error: 'Failed to delete reminder' },
      { status: 500 }
    )
  }
}
