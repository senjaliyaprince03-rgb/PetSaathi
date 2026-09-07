import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function run() {
  const users = await prisma.user.findMany({ include: { roles: true }});
  console.log('Users:', users.map(u => ({ id: u.id, name: u.displayName, roles: u.roles.map(r => r.role) })));

  const pets = await prisma.pet.findMany({ include: { owner: true } });
  console.log('Pets:', pets.map(p => ({ id: p.id, name: p.name, species: p.species, breed: p.breed, owner: p.owner.displayName })));
  
  const bookings = await prisma.booking.findMany();
  console.log('Bookings:', bookings.length);
}
run().catch(console.error).finally(() => prisma.$disconnect());
