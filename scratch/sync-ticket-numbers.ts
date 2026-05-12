import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Sincronizando Números de Ticket con Números de Contrato ---');

  const tickets = await prisma.supportTicket.findMany({
    include: {
      contract: true
    }
  });

  console.log(`Encontrados ${tickets.length} tickets para procesar.`);

  for (const ticket of tickets) {
    if (ticket.contract) {
      const oldNumber = ticket.ticketNumber;
      const newNumber = ticket.contract.contractNumber;

      if (oldNumber !== newNumber) {
        await prisma.supportTicket.update({
          where: { id: ticket.id },
          data: { ticketNumber: newNumber }
        });
        console.log(`Actualizado: ${oldNumber} -> ${newNumber}`);
      } else {
        console.log(`Ya sincronizado: ${newNumber}`);
      }
    } else {
      console.log(`Ticket ${ticket.ticketNumber} no tiene contrato vinculado. Saltando.`);
    }
  }

  console.log('--- Sincronización Finalizada ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
