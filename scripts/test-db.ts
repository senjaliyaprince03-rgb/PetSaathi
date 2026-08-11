import { PrismaClient } from '@prisma/client'

const p = new PrismaClient()

async function main() { 
  console.log('Connecting to database...');
  await p.$connect(); 
  console.log('✅ Connected to MongoDB Atlas successfully.'); 
  
  // Test a simple query
  const count = await p.user.count();
  console.log(`Verified reading: ${count} users found.`);
  
  await p.$disconnect(); 
}

main().catch(err => {
  console.error('❌ Connection failed:', err);
  process.exit(1);
})
