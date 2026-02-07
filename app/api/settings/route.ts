import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

function sanitizeText(value: unknown) {
  if (typeof value !== 'string') return value
  return value.replace(/(.)\1{5,}/g, (match) => match[0].repeat(5))
}

async function ensureTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS church_settings (
      id TEXT PRIMARY KEY DEFAULT 'main',
      active_members INTEGER DEFAULT 0,
      ministry_partnerships INTEGER DEFAULT 0,
      poster_url TEXT DEFAULT NULL,
      poster_alt TEXT DEFAULT NULL,
      poster_expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
      poster_event_title TEXT DEFAULT NULL,
      poster_event_date TEXT DEFAULT NULL,
      poster_event_time TEXT DEFAULT NULL,
      poster_event_location TEXT DEFAULT NULL,
      poster_description TEXT DEFAULT NULL,
      poster_speaker TEXT DEFAULT NULL,
      poster_theme TEXT DEFAULT NULL,
      poster_agenda TEXT DEFAULT NULL,
      poster_details TEXT DEFAULT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `)
  // Ensure poster columns exist on older installs where table already existed
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE church_settings ADD COLUMN IF NOT EXISTS poster_url TEXT DEFAULT NULL`)
    await prisma.$executeRawUnsafe(`ALTER TABLE church_settings ADD COLUMN IF NOT EXISTS poster_alt TEXT DEFAULT NULL`)
    await prisma.$executeRawUnsafe(`ALTER TABLE church_settings ADD COLUMN IF NOT EXISTS poster_expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL`)
    await prisma.$executeRawUnsafe(`ALTER TABLE church_settings ADD COLUMN IF NOT EXISTS poster_event_title TEXT DEFAULT NULL`)
    await prisma.$executeRawUnsafe(`ALTER TABLE church_settings ADD COLUMN IF NOT EXISTS poster_event_date TEXT DEFAULT NULL`)
    await prisma.$executeRawUnsafe(`ALTER TABLE church_settings ADD COLUMN IF NOT EXISTS poster_event_time TEXT DEFAULT NULL`)
    await prisma.$executeRawUnsafe(`ALTER TABLE church_settings ADD COLUMN IF NOT EXISTS poster_event_location TEXT DEFAULT NULL`)
    await prisma.$executeRawUnsafe(`ALTER TABLE church_settings ADD COLUMN IF NOT EXISTS poster_description TEXT DEFAULT NULL`)
    await prisma.$executeRawUnsafe(`ALTER TABLE church_settings ADD COLUMN IF NOT EXISTS poster_speaker TEXT DEFAULT NULL`)
    await prisma.$executeRawUnsafe(`ALTER TABLE church_settings ADD COLUMN IF NOT EXISTS poster_theme TEXT DEFAULT NULL`)
    await prisma.$executeRawUnsafe(`ALTER TABLE church_settings ADD COLUMN IF NOT EXISTS poster_agenda TEXT DEFAULT NULL`)
    await prisma.$executeRawUnsafe(`ALTER TABLE church_settings ADD COLUMN IF NOT EXISTS poster_details TEXT DEFAULT NULL`)
  } catch (e) {
    // ignore; some DBs may not support IF NOT EXISTS but CREATE TABLE above handles most cases
  }
  // Initialize with default values if no record exists
  const exists = await prisma.$queryRaw`SELECT id FROM church_settings WHERE id = 'main' LIMIT 1`
  if (!Array.isArray(exists) || exists.length === 0) {
    await prisma.$executeRaw`INSERT INTO church_settings (id, active_members, ministry_partnerships) VALUES ('main', 2000, 50)`
  }
}

export const dynamic = 'force-dynamic'


export async function GET() {
  try {
    await ensureTable()
    const rows: any[] = await prisma.$queryRaw`SELECT 
      active_members as "activeMembers", 
      ministry_partnerships as "ministryPartnerships", 
      poster_url as "posterUrl", 
      poster_alt as "posterAlt", 
      poster_expires_at as "posterExpiresAt", 
      poster_event_title as "posterEventTitle",
      poster_event_date as "posterEventDate",
      poster_event_time as "posterEventTime",
      poster_event_location as "posterEventLocation",
      poster_description as "posterDescription",
      poster_speaker as "posterSpeaker",
      poster_theme as "posterTheme",
      poster_agenda as "posterAgenda",
      poster_details as "posterDetails"
    FROM church_settings WHERE id = 'main' LIMIT 1`
    const settings = rows && rows.length ? rows[0] : { 
      activeMembers: 2000, 
      ministryPartnerships: 50, 
      posterUrl: null, 
      posterAlt: null, 
      posterExpiresAt: null, 
      posterEventTitle: null,
      posterEventDate: null,
      posterEventTime: null,
      posterEventLocation: null,
      posterDescription: null,
      posterSpeaker: null,
      posterTheme: null,
      posterAgenda: null,
      posterDetails: null
    }

    settings.posterEventTitle = sanitizeText(settings.posterEventTitle)
    settings.posterEventLocation = sanitizeText(settings.posterEventLocation)
    settings.posterDescription = sanitizeText(settings.posterDescription)
    settings.posterSpeaker = sanitizeText(settings.posterSpeaker)
    settings.posterTheme = sanitizeText(settings.posterTheme)
    settings.posterAgenda = sanitizeText(settings.posterAgenda)
    settings.posterDetails = sanitizeText(settings.posterDetails)

    // If poster has expired, clear it automatically and remove files
    try {
      if (settings.posterUrl && settings.posterExpiresAt) {
        const expires = new Date(settings.posterExpiresAt)
        if (!isNaN(expires.getTime()) && expires.getTime() < Date.now()) {
          // attempt to remove file(s) from public/uploads
          try {
            const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
            const posterPath = String(settings.posterUrl)
            const fileName = posterPath.includes('/uploads/') ? posterPath.split('/uploads/').pop() : null
            if (fileName) {
              const fullPath = path.join(uploadsDir, fileName)
              if (fs.existsSync(fullPath)) {
                try { fs.unlinkSync(fullPath) } catch (e) { console.error('Failed to delete poster file', fullPath, e) }
              }

              // try to delete thumbnail using the unique prefix
              const unique = fileName.split('-')[0]
              const baseWithExt = fileName.slice(unique.length + 1)
              const baseName = baseWithExt.replace(path.extname(baseWithExt), '')
              const thumbName = `${unique}-thumb-${baseName}.jpg`
              const thumbPath = path.join(uploadsDir, thumbName)
              if (fs.existsSync(thumbPath)) {
                try { fs.unlinkSync(thumbPath) } catch (e) { console.error('Failed to delete thumb', thumbPath, e) }
              }
            }
          } catch (e) {
            console.error('Failed to remove poster files', e)
          }

          await prisma.$executeRaw`UPDATE church_settings SET poster_url = NULL, poster_alt = NULL, poster_expires_at = NULL, updated_at = NOW() WHERE id = 'main'`
          settings.posterUrl = null
          settings.posterAlt = null
          settings.posterExpiresAt = null
        }
      }
    } catch (e) {
      console.error('Failed to clear expired poster', e)
    }
    
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
    if (body.posterUrl !== undefined) {
      await prisma.$executeRaw`UPDATE church_settings SET poster_url = ${body.posterUrl}, updated_at = NOW() WHERE id = 'main'`
    }
    if (body.posterAlt !== undefined) {
      await prisma.$executeRaw`UPDATE church_settings SET poster_alt = ${body.posterAlt}, updated_at = NOW() WHERE id = 'main'`
    }
    if (body.posterExpiresAt !== undefined) {
      // Accept ISO string or null
      const val = body.posterExpiresAt ? String(body.posterExpiresAt) : null
      await prisma.$executeRaw`UPDATE church_settings SET poster_expires_at = ${val}, updated_at = NOW() WHERE id = 'main'`
    }
    if (body.posterEventTitle !== undefined) {
      const value = sanitizeText(body.posterEventTitle) || null
      await prisma.$executeRaw`UPDATE church_settings SET poster_event_title = ${value}, updated_at = NOW() WHERE id = 'main'`
    }
    if (body.posterEventDate !== undefined) {
      await prisma.$executeRaw`UPDATE church_settings SET poster_event_date = ${body.posterEventDate || null}, updated_at = NOW() WHERE id = 'main'`
    }
    if (body.posterEventTime !== undefined) {
      await prisma.$executeRaw`UPDATE church_settings SET poster_event_time = ${body.posterEventTime || null}, updated_at = NOW() WHERE id = 'main'`
    }
    if (body.posterEventLocation !== undefined) {
      const value = sanitizeText(body.posterEventLocation) || null
      await prisma.$executeRaw`UPDATE church_settings SET poster_event_location = ${value}, updated_at = NOW() WHERE id = 'main'`
    }
    if (body.posterDescription !== undefined) {
      const value = sanitizeText(body.posterDescription) || null
      await prisma.$executeRaw`UPDATE church_settings SET poster_description = ${value}, updated_at = NOW() WHERE id = 'main'`
    }
    if (body.posterSpeaker !== undefined) {
      const value = sanitizeText(body.posterSpeaker) || null
      await prisma.$executeRaw`UPDATE church_settings SET poster_speaker = ${value}, updated_at = NOW() WHERE id = 'main'`
    }
    if (body.posterTheme !== undefined) {
      const value = sanitizeText(body.posterTheme) || null
      await prisma.$executeRaw`UPDATE church_settings SET poster_theme = ${value}, updated_at = NOW() WHERE id = 'main'`
    }
    if (body.posterAgenda !== undefined) {
      const value = sanitizeText(body.posterAgenda) || null
      await prisma.$executeRaw`UPDATE church_settings SET poster_agenda = ${value}, updated_at = NOW() WHERE id = 'main'`
    }
    if (body.posterDetails !== undefined) {
      const value = sanitizeText(body.posterDetails) || null
      await prisma.$executeRaw`UPDATE church_settings SET poster_details = ${value}, updated_at = NOW() WHERE id = 'main'`
    }
    
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
