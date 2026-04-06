import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('Testing connection to:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));
  try {
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    console.log('Successfully connected to Neon database via Prisma!', result);
  } catch (error) {
    console.error('Prisma connection error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
