import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const alice = await prisma.user.create({
    data: {
      email: 'alice@prisma.io',
      role: 'admin',
      requests: {
        create: {
          title: 'Six Flags',
          description: 'The best theme park in the world',
          status: 'pending',
        },
      },
    },
  });
  const bob = await prisma.user.create({
    data: {
      email: 'bob@prisma.io',
      role: 'user',
      requests: {
        create: [
          {
            title: 'Fiesta Texas',
            description: 'The best theme park in the world',
            status: 'pending',
          },
          {
            title: 'Six Flags Over Texas',
            description: 'The best theme park in the world',
            status: 'pending',
          },
        ],
      },
    },
  });
  console.log({ alice, bob });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
