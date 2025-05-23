import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const createRandomUser = () => {
  return {
    email: faker.internet.email(),
    lastName: faker.person.lastName(),
    firstName: faker.person.firstName(),
    ein: faker.number.int({ min: 100000, max: 99999999 }),
    children: faker.number.int({ min: 0, max: 10 }),
    guest: faker.datatype.boolean(),
    jobNumber: [
      'Equipment Group',
      'Estimating',
      'Human Resources',
      'Acctg., Fin., Payroll, and Trsry',
      'Business Admin and BPC',
      'Corporate Mgmt',
    ][Math.floor(Math.random() * 5)],
  };
};

async function main() {
  const users: any[] = [];
  for (const user of Array.from({ length: 100 }, createRandomUser)) {
    const u = await prisma.user.create({
      data: user,
    });
    users.push(u);
  }

  for (let i = 0; i < 100; i++) {
    const submissions = await prisma.submission.create({
      data: {
        userId: users[i].id,
        park: ['Fiesta Texas', 'Six Flags Over Texas', 'Carowinds'][
          Math.floor(Math.random() * 3)
        ],
        fullTicket: faker.number.int({ min: 1, max: 10 }),
        mealTicket: faker.number.int({ min: 1, max: 10 }),
        additionalFullTicket: faker.number.int({ min: 0, max: 10 }),
        additionalMealTicket: faker.number.int({ min: 0, max: 10 }),
        payrollDeduction: faker.datatype.boolean(),
        deductionPeriods: faker.number.int({ min: 1, max: 4 }),
        childrenVerification: faker.datatype.boolean(),
        pendingDependentChildren: faker.number.int({ min: 0, max: 10 }),
        ticketsToBeDistributed: faker.number.int({ min: 1, max: 10 }),
        notes: faker.lorem.sentence(),
      },
    });
  }
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
