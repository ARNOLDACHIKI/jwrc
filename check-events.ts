import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const events = await prisma.event.findMany({
    orderBy: { startsAt: 'desc' },
    take: 10,
  })
  
  console.log('All events:')
  console.table(events)
  
  const futureEvents = await prisma.event.findMany({
    where: {
      startsAt: { gte: new Date() }
    },
    orderBy: { startsAt: 'asc' },
  })
  
  console.log('\nFuture events:')
  console.table(futureEvents)
}

main().then(() => process.exit(0)).catch(e => {
  console.error(e)
  process.exit(1)
})
