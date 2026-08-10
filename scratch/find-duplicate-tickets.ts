import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("--- BUSCANDO DUPLICADOS EN TICKETS ---");
  
  // Vamos a listar los últimos 15 tickets de soporte creados, con su contrato, categoría y status.
  const tickets = await prisma.supportTicket.findMany({
    take: 15,
    orderBy: { createdAt: 'desc' },
    include: {
      contract: true
    }
  });

  console.log("Últimos 15 tickets:");
  tickets.forEach(t => {
    console.log(`ID: ${t.id.slice(0, 8)} | N°: ${t.ticketNumber} | Título: ${t.title} | Cat: ${t.category} | Status: ${t.status} | Contract: ${t.contract?.contractNumber} (Status Contract: ${t.contract?.status})`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
