import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanupCorruptedData() {
  try {
    console.log('Starting database cleanup...')

    // Clear all obviously corrupted test data 
    console.log('Clearing corrupted test data...')
    await prisma.$executeRawUnsafe(`
      UPDATE church_settings
      SET 
        poster_theme = NULL,
        poster_speaker = NULL,
        poster_description = NULL,
        poster_agenda = NULL,
        poster_details = NULL,
        poster_event_title = NULL,
        poster_event_location = NULL,
        updated_at = NOW()
      WHERE id = 'main'
    `)
    console.log('✓ All poster fields cleared')

    // Verify the cleanup
    const result: any[] = await prisma.$queryRawUnsafe(`
      SELECT 
        poster_theme, 
        poster_speaker,
        poster_description,
        poster_agenda,
        poster_details,
        poster_event_title,
        poster_event_location
      FROM church_settings WHERE id = 'main'
    `)

    if (result.length > 0) {
      console.log('\n✓ Database cleanup complete!')
      console.log('Current settings:', result[0])
    }

  } catch (error) {
    console.error('Error during cleanup:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

cleanupCorruptedData()
