import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const alice = await prisma.user.create({
    data: {
      email: 'alice@prisma.io',
      lastName: 'Smith',
      firstName: 'Alice',
      ein: 123456789,
      children: 0,
      guest: false,
    },
  });
  const bob = await prisma.user.create({
    data: {
      email: 'bob@prisma.io',
      lastName: 'Smith',
      firstName: 'Bob',
      ein: 987654321,
      children: 0,
      guest: false,
    },
  });
  const submissions = await prisma.submission.create({
    data: {
      userId: alice.id,
      park: 'Fiesta Texas',
      fullTicket: 100,
      mealTicket: 50,
      payrollDeduction: true,
      deductionPeriod: 1,
    },
  });
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
