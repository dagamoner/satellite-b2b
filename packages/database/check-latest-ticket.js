const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const t = await prisma.supportTicket.findMany({orderBy: {createdAt: 'desc'}, take: 3});
  for (const ticket of t) {
    console.log("TICKET:", ticket.ticketNumber, "STATUS:", ticket.status);
    if (ticket.contractId) {
      const c = await prisma.installationContract.findFirst({where: {id: ticket.contractId}});
      console.log("CONTRACT:", c ? c.status : 'None');
    }
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
