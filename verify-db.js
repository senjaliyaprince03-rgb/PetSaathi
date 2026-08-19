/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDb() {
  try {
    const usersCount = await prisma.user.count();
    console.log(`Database connected successfully. Total Users: ${usersCount}`);
    
    // Check specific roles if needed
    const admins = await prisma.user.findMany({
      where: { roles: { some: { role: 'ADMIN' } } },
      select: { displayName: true },
      take: 2
    });
    console.log(`Found ${admins.length} admins.`);
    
    // Clean exit
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
}

checkDb();
