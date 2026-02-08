import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const settings = await prisma.$queryRaw`SELECT 
      poster_theme,
      poster_speaker,
      poster_description,
      poster_agenda,
      poster_details
    FROM church_settings WHERE id = 'main'`
    
    console.log('=== Current poster data in database ===')
    console.log(JSON.stringify(settings, null, 2))
    
    // Also show character-by-character breakdown
    if (Array.isArray(settings) && settings.length > 0) {
      const data = settings[0] as any
      console.log('\n=== Character breakdown ===')
      console.log(`Theme: "${data.poster_theme}"`)
      console.log(`  Length: ${data.poster_theme?.length || 0}`)
      console.log(`Speaker: "${data.poster_speaker}"`)
      console.log(`  Length: ${data.poster_speaker?.length || 0}`)
      console.log(`Description: "${data.poster_description}"`)
      console.log(`  Length: ${data.poster_description?.length || 0}`)
      console.log(`Agenda: "${data.poster_agenda}"`)
      console.log(`  Length: ${data.poster_agenda?.length || 0}`)
      console.log(`Details: "${data.poster_details}"`)
      console.log(`  Length: ${data.poster_details?.length || 0}`)
    }
  } catch (e) {
    console.error('Error:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
