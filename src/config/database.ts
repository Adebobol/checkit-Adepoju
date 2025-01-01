import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function connectToDatabase() {
  try {
    await prisma.$disconnect();
    console.log('Connected ');
  } catch (error) {
    console.error('Error');
  } finally {
    await prisma.$disconnect();
  }
}

export { prisma, connectToDatabase };
