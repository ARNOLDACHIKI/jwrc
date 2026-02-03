import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Create a future event
  const futureEvent = await prisma.event.create({
    data: {
      title: "Sunday Service",
      description: "Join us for worship, praise and preaching",
      location: "JWRC Main Hall, Juja",
      startsAt: new Date(2026, 1, 2, 9, 0), // February 2, 2026 at 9 AM
      endsAt: new Date(2026, 1, 2, 11, 30), // 11:30 AM
    }
  })
  
  console.log('Created future event:')
  console.table([futureEvent])
  
  // Check all future events
  const futureEvents = await prisma.event.findMany({
    where: {
      startsAt: { gte: new Date() }
    },
    orderBy: { startsAt: 'asc' },
  })
  
  console.log('\nAll future events:')
  console.table(futureEvents)
}

main().then(() => process.exit(0)).catch(e => {
  console.error(e)
  process.exit(1)
})
