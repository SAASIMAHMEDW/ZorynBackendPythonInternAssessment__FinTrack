import 'dotenv/config';
import { PrismaClient, Role, TransactionType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ─── Seed Users ─────────────────────────────────────────────
const seedUsers = async () => {
  const password = await bcrypt.hash('Admin@123', 12);
  const users = [
    { email: 'admin@fintrack.com', password, firstName: 'Admin', lastName: 'User', role: 'ADMIN' as Role },
    { email: 'analyst@fintrack.com', password: await bcrypt.hash('Analyst@123', 12), firstName: 'Sarah', lastName: 'Analyst', role: 'ANALYST' as Role },
    { email: 'viewer@fintrack.com', password: await bcrypt.hash('Viewer@123', 12), firstName: 'John', lastName: 'Viewer', role: 'VIEWER' as Role },
  ];

  for (const u of users) {
    await prisma.user.upsert({ where: { email: u.email }, update: {}, create: u });
    console.log(`  ✓ User: ${u.email}`);
  }
  return prisma.user.findMany();
};

const categories = {
  INCOME: ['Salary', 'Freelance', 'Investment'],
  EXPENSE: ['Rent', 'Groceries', 'Utilities', 'Entertainment', 'Healthcare', 'Travel'],
};

// ─── Main ───────────────────────────────────────────────────
async function main() {
  console.log('\n🌱 Seeding database...');

  const users = await seedUsers();
  const admin = users.find((u) => u.role === 'ADMIN')!;
  const analyst = users.find((u) => u.role === 'ANALYST')!;

  // Cleanup
  await prisma.dashboardConfig.deleteMany();
  await prisma.financialRecord.deleteMany();

  // Create records in bulk
  const records = [];
  for (let i = 0; i < 200; i++) {
    const type: TransactionType = Math.random() > 0.3 ? 'EXPENSE' : 'INCOME';
    const cats = categories[type];
    const category = cats[Math.floor(Math.random() * cats.length)];
    
    records.push({
      amount: type === 'INCOME' ? 3000 + Math.random() * 2000 : 50 + Math.random() * 500,
      type,
      category,
      date: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)),
      description: `${category} transaction`,
      createdBy: admin.id,
    });
  }

  await prisma.financialRecord.createMany({ data: records });
  console.log(`  ✓ Created ${records.length} records`);

  const defaultLayout = [
    { i: 'summary', x: 0, y: 0, w: 12, h: 2, static: false },
    { i: 'trends', x: 0, y: 2, w: 8, h: 4 },
    { i: 'categories', x: 8, y: 2, w: 4, h: 4 },
    { i: 'recent', x: 0, y: 6, w: 12, h: 4 },
  ];

  const defaultCharts = [
    { id: 'trends', type: 'AREA', title: 'Financial Trends' },
    { id: 'categories', type: 'PIE', title: 'Top Categories' },
  ];

  await prisma.dashboardConfig.create({
    data: { userId: admin.id, layout: defaultLayout, charts: defaultCharts },
  });

  await prisma.dashboardConfig.create({
    data: { userId: analyst.id, layout: defaultLayout, charts: defaultCharts },
  });

  console.log('✅ Seed complete!\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
