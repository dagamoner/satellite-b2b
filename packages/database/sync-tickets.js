const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const contracts = await prisma.installationContract.findMany();
  for (const c of contracts) {
    const mappedTicketStatus = 
        c.status === "COMPLETED" ? "COMPLETED" :
        (c.status === "IN_PROGRESS" || c.status === "APPROVED") ? "TECH_IN_PROGRESS" :
        c.status === "SIGNATURE_PENDING" ? "SIGNATURE_PENDING" :
        c.status === "PENDING" ? "CONTRACT_INITIATED" :
        undefined;

    if (mappedTicketStatus) {
      const tickets = await prisma.supportTicket.findMany({ where: { contractId: c.id } });
      for (const t of tickets) {
        if (t.status !== mappedTicketStatus) {
          console.log(`Fixing ticket ${t.ticketNumber} from ${t.status} to ${mappedTicketStatus}`);
          await prisma.supportTicket.update({
            where: { id: t.id },
            data: { status: mappedTicketStatus }
          });
        }
      }
    }
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
