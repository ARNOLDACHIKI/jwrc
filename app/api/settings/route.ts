import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function ensureTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS church_settings (
      id TEXT PRIMARY KEY DEFAULT 'main',
      active_members INTEGER DEFAULT 0,
      ministry_partnerships INTEGER DEFAULT 0,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `)
  // Initialize with default values if no record exists
  const exists = await prisma.$queryRaw`SELECT id FROM church_settings WHERE id = 'main' LIMIT 1`
  if (!Array.isArray(exists) || exists.length === 0) {
    await prisma.$executeRaw`INSERT INTO church_settings (id, active_members, ministry_partnerships) VALUES ('main', 2000, 50)`
  }
}

export async function GET() {
  try {
    await ensureTable()
    const rows: any[] = await prisma.$queryRaw`SELECT active_members as "activeMembers", ministry_partnerships as "ministryPartnerships" FROM church_settings WHERE id = 'main' LIMIT 1`
    const settings = rows && rows.length ? rows[0] : { activeMembers: 2000, ministryPartnerships: 50 }
    
    // Calculate years serving from Feb 7, 2020
    const foundingDate = new Date('2020-02-07')
    const now = new Date()
    const yearsServing = Math.floor((now.getTime() - foundingDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    
    return NextResponse.json({ 
      settings,
      yearsServing 
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { activeMembers, ministryPartnerships } = body || {}
    
    await ensureTable()
    
    if (activeMembers !== undefined) {
      await prisma.$executeRaw`UPDATE church_settings SET active_members = ${Number(activeMembers)}, updated_at = NOW() WHERE id = 'main'`
    }
    
    if (ministryPartnerships !== undefined) {
      await prisma.$executeRaw`UPDATE church_settings SET ministry_partnerships = ${Number(ministryPartnerships)}, updated_at = NOW() WHERE id = 'main'`
    }
    
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
