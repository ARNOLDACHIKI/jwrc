import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function ensureEventSignupsTable() {
  // Ensure pgcrypto extension exists for gen_random_uuid()
  try {
    await prisma.$executeRawUnsafe('CREATE EXTENSION IF NOT EXISTS pgcrypto')
  } catch (e) {
    console.error('Error creating pgcrypto extension (may already exist):', e)
  }

  // Create event_signups table if missing
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS event_signups (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      event_id TEXT NOT NULL,
      ref TEXT UNIQUE,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
  `)

  // Ensure unique index exists
  await prisma.$executeRawUnsafe(
    'CREATE UNIQUE INDEX IF NOT EXISTS event_signups_ref_idx ON event_signups(ref)'
  )
}

async function main() {
  console.log('Ensuring event_signups table exists...')
  await ensureEventSignupsTable()
  console.log('Done.')
}

main()
  .catch((err) => {
    console.error('Fix script error:', err)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
