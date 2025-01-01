import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function connectToDatabase() {
  try {
    await prisma.$disconnect();
    console.log(`Prisma connected\nApp running on port ${process.env.PORT}`);
  } catch (error) {
    console.error('Error');
  } finally {
    await prisma.$disconnect();
  }
}

export { prisma, connectToDatabase };
