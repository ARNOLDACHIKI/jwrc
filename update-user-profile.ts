import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Update the user's profile
  const user = await prisma.user.update({
    where: { email: 'achikiarnold@gmail.com' },
    data: {
      name: 'arnold achiki',
      phone: '+254711413919'
    }
  })
  
  console.log('Updated user:')
  console.table([user])
}

main().then(() => process.exit(0)).catch(e => {
  console.error(e)
  process.exit(1)
})
