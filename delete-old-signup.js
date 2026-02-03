const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Delete the old signup with the wrong name
  const deleted = await prisma.eventSignup.deleteMany({
    where: {
      email: 'jwrcjuja.1@gmail.com' // The old signup with the reverend's email
    }
  });
  
  console.log('Deleted signups:', deleted.count);
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
