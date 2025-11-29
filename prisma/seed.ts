import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

type SeedData = {
  users?: Array<{ email: string; name?: string; role?: string; password?: string; passwordHash?: string }>
  sermons?: Array<{ title: string; slug: string; summary?: string; content?: string; speaker?: string; date: string }>
  events?: Array<{ title: string; description?: string; location?: string; startsAt: string; endsAt?: string }>
  announcements?: Array<{ title: string; content: string; author?: string }>
  donations?: Array<{ donorName?: string; amount: number; method?: string }>
}

async function main() {
  console.log('Starting Prisma seed...')

  // Option 1: If a JSON file path is provided via PROD_SEED_PATH, load it.
  const seedPath = process.env.PROD_SEED_PATH || path.join(process.cwd(), 'prisma', 'seed-data.json')
  let seed: SeedData | null = null

  if (fs.existsSync(seedPath)) {
    console.log('Loading seed data from', seedPath)
    seed = JSON.parse(fs.readFileSync(seedPath, 'utf8')) as SeedData
  } else {
    console.log('No production seed JSON found at', seedPath)
    seed = null
  }

  // Admin user from env vars (recommended for production)
  const adminEmail = process.env.ADMIN_EMAIL
  const adminName = process.env.ADMIN_NAME || 'Admin'
  const adminPassword = process.env.ADMIN_PASSWORD // plain password (will be hashed)
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH // pre-hashed password

  if (!seed && !adminEmail) {
    console.warn('No seed file and no ADMIN_EMAIL provided. Skipping data seeding.')
    console.warn('To seed production data, provide a JSON file at prisma/seed-data.json or set ADMIN_EMAIL and ADMIN_PASSWORD( or ADMIN_PASSWORD_HASH ).')
    return
  }

  try {
    // Seed from JSON if available
    if (seed) {
      if (seed.users && seed.users.length) {
        for (const u of seed.users) {
          const email = u.email
          const name = u.name || null
          const role = u.role || 'member'
          let passwordHash = u.passwordHash || null
          if (!passwordHash && u.password) {
            passwordHash = await bcrypt.hash(u.password, 10)
          }
          await prisma.user.upsert({
            where: { email },
            update: { name: name ?? undefined, role },
            create: { email, name: name ?? undefined, role, password: passwordHash ?? undefined },
          })
        }
      }

      if (seed.sermons && seed.sermons.length) {
        for (const s of seed.sermons) {
          await prisma.sermon.upsert({
            where: { slug: s.slug },
            update: { title: s.title, summary: s.summary ?? undefined, content: s.content ?? undefined, speaker: s.speaker ?? undefined, date: new Date(s.date) },
            create: { title: s.title, slug: s.slug, summary: s.summary ?? undefined, content: s.content ?? undefined, speaker: s.speaker ?? undefined, date: new Date(s.date) },
          })
        }
      }

      if (seed.events && seed.events.length) {
        for (const e of seed.events) {
          await prisma.event.createMany({ data: [{ title: e.title, description: e.description ?? undefined, location: e.location ?? undefined, startsAt: new Date(e.startsAt), endsAt: e.endsAt ? new Date(e.endsAt) : undefined }], skipDuplicates: true })
        }
      }

      if (seed.announcements && seed.announcements.length) {
        for (const a of seed.announcements) {
          await prisma.announcement.createMany({ data: [{ title: a.title, content: a.content, author: a.author ?? undefined }], skipDuplicates: true })
        }
      }

      if (seed.donations && seed.donations.length) {
        for (const d of seed.donations) {
          await prisma.donation.createMany({ data: [{ donorName: d.donorName ?? undefined, amount: d.amount, method: d.method ?? undefined }], skipDuplicates: true })
        }
      }
    }

    // If admin env provided, ensure admin exists
    if (adminEmail) {
      let finalHash = adminPasswordHash
      if (!finalHash && adminPassword) {
        console.log('Hashing ADMIN_PASSWORD for admin user')
        finalHash = await bcrypt.hash(adminPassword, 12)
      }

      if (!finalHash) {
        console.warn('No ADMIN_PASSWORD or ADMIN_PASSWORD_HASH provided. Admin user will be created without a password. Please set a secure password.')
      }

      await prisma.user.upsert({
        where: { email: adminEmail },
        update: { name: adminName, role: 'admin', password: finalHash ?? undefined },
        create: { email: adminEmail, name: adminName, role: 'admin', password: finalHash ?? undefined },
      })

      console.log('Admin user upserted:', adminEmail)
    }

    console.log('Seeding complete.')
  } catch (err) {
    console.error('Error running seed:', err)
    process.exitCode = 1
  } finally {
    await prisma.$disconnect()
  }
}

main()
