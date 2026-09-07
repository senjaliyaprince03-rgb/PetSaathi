import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function run() {
  const users = await prisma.user.findMany({ include: { roles: true }});
  
  const customerUser = users.find(u => u.roles.some(r => r.role === "CUSTOMER"));
  const saathiUser = users.find(u => u.roles.some(r => r.role === "SITTER"));
  const adminUser = users.find(u => u.roles.some(r => r.role === "SUPER_ADMIN"));

  const customerBookings = customerUser ? await prisma.booking.findMany({ where: { customerId: customerUser.id }, include: { pets: { include: { pet: true } }, assignments: { include: { sitter: true } } } }) : [];
  const saathiBookings = saathiUser ? await prisma.bookingAssignment.findMany({ where: { sitterId: saathiUser.id }, include: { booking: { include: { customer: true, pets: { include: { pet: true } } } } } }) : [];

  console.log("Customer Bookings:", JSON.stringify(customerBookings.slice(0,1), null, 2));
  console.log("Saathi Bookings:", JSON.stringify(saathiBookings.slice(0,1), null, 2));
}
run().catch(console.error).finally(() => prisma.$disconnect());
