const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.update({
    where: { email: 'achikiarnold@gmail.com' },
    data: {
      name: 'arnold achiki',
      phone: '+254711413919'
    }
  });
  
  console.log('Updated user:', user);
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
