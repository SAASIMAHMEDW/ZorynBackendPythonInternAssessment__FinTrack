import { PrismaClient, TransactionType } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import 'dotenv/config';

// Set up WebSocket for environments where TCP 5432 is blocked
neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const ADMIN_ID = 'cmnj9x55q0000u9cwcjaso8yv'; // admin@fintrack.com

async function main() {
  console.log('🌱 Seeding financial data...');

  // 1. Clear existing records for this user to start fresh
  await prisma.financialRecord.deleteMany({
    where: { createdBy: ADMIN_ID }
  });

  const categories = {
    INCOME: ['Salary', 'Freelance', 'Dividends', 'Gift', 'Refund'],
    EXPENSE: ['Rent', 'Groceries', 'Utilities', 'Travel', 'Entertainment', 'Health', 'Shopping', 'Dining Out']
  };

  const records = [];
  const now = new Date();
  
  // Generate 12 months of data
  for (let m = 0; m < 12; m++) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - m, 15);
    
    // Monthly Salary
    records.push({
      amount: 5000 + Math.random() * 500,
      type: TransactionType.INCOME,
      category: 'Salary',
      date: new Date(monthDate.getFullYear(), monthDate.getMonth(), 1),
      description: 'Monthly paycheck',
      createdBy: ADMIN_ID
    });

    // Random Freelance Income
    if (Math.random() > 0.5) {
      records.push({
        amount: 500 + Math.random() * 1500,
        type: TransactionType.INCOME,
        category: 'Freelance',
        date: new Date(monthDate.getFullYear(), monthDate.getMonth(), 10 + Math.floor(Math.random() * 15)),
        description: 'Project milestone',
        createdBy: ADMIN_ID
      });
    }

    // Fixed Expenses
    records.push({
      amount: 1500,
      type: TransactionType.EXPENSE,
      category: 'Rent',
      date: new Date(monthDate.getFullYear(), monthDate.getMonth(), 2),
      description: 'Monthly rent',
      createdBy: ADMIN_ID
    });

    records.push({
      amount: 150 + Math.random() * 100,
      type: TransactionType.EXPENSE,
      category: 'Utilities',
      date: new Date(monthDate.getFullYear(), monthDate.getMonth(), 5),
      description: 'Electricity & Water',
      createdBy: ADMIN_ID
    });

    // Variable Expenses (Multiple per month)
    const groceriesCount = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < groceriesCount; i++) {
        records.push({
          amount: 50 + Math.random() * 150,
          type: TransactionType.EXPENSE,
          category: 'Groceries',
          date: new Date(monthDate.getFullYear(), monthDate.getMonth(), 5 + i * 7),
          description: 'Weekly groceries',
          createdBy: ADMIN_ID
        });
    }

    const dinningCount = 2 + Math.floor(Math.random() * 4);
    for (let i = 0; i < dinningCount; i++) {
        records.push({
          amount: 30 + Math.random() * 100,
          type: TransactionType.EXPENSE,
          category: 'Dining Out',
          date: new Date(monthDate.getFullYear(), monthDate.getMonth(), Math.floor(Math.random() * 28) + 1),
          description: 'Dinner with friends',
          createdBy: ADMIN_ID
        });
    }

    // Seasonal/One-off Expenses
    if (monthDate.getMonth() === 11 || monthDate.getMonth() === 7) { // Dec or Aug (Holidays)
        records.push({
            amount: 800 + Math.random() * 1200,
            type: TransactionType.EXPENSE,
            category: 'Travel',
            date: new Date(monthDate.getFullYear(), monthDate.getMonth(), 20),
            description: 'Holiday trip',
            createdBy: ADMIN_ID
        });
    }

    if (Math.random() > 0.7) {
        records.push({
            amount: 200 + Math.random() * 500,
            type: TransactionType.EXPENSE,
            category: 'Shopping',
            date: new Date(monthDate.getFullYear(), monthDate.getMonth(), 15),
            description: 'Gadget/Clothes purchase',
            createdBy: ADMIN_ID
        });
    }
  }

  // Batch insert
  await prisma.financialRecord.createMany({
    data: records
  });

  console.log(`✅ Successfully seeded ${records.length} records.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
