const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const t = await prisma.supportTicket.findFirst({where: {ticketNumber: 'SOL-2026-0076'}});
  console.log("TICKET:", t.status);
  const c = await prisma.installationContract.findFirst({where: {id: t.contractId}});
  console.log("CONTRACT:", c.status);
}
main().catch(console.error).finally(() => prisma.$disconnect());
