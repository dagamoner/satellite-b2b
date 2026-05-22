import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("=== LEADS EN LA TABLA Lead ===");
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10
  });
  console.log(JSON.stringify(leads, null, 2));

  console.log("=== CONTRATOS EN ESTADO LEAD ===");
  const contracts = await prisma.installationContract.findMany({
    where: { status: 'LEAD' },
    orderBy: { createdAt: 'desc' },
    take: 10
  });
  console.log(JSON.stringify(contracts, null, 2));

  console.log("=== TOTAL TICKETS ===");
  const ticketCount = await prisma.supportTicket.count();
  console.log("Total tickets en la base de datos:", ticketCount);

  const tickets = await prisma.supportTicket.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      contract: {
        select: {
          clientName: true,
          contractNumber: true
        }
      }
    }
  });
  console.log("Últimos 5 tickets:", JSON.stringify(tickets, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
