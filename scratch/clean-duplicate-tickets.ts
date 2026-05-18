import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const STATUS_RANK: Record<string, number> = {
  COMPLETED: 3,
  TECH_IN_PROGRESS: 2,
  OPEN: 1
};

async function main() {
  console.log("--- INICIANDO LIMPIEZA DE TICKETS DE CONTRATO DUPLICADOS ---");

  // Obtener todos los contratos
  const contracts = await prisma.installationContract.findMany({
    include: {
      tickets: {
        where: { category: "Contrato" },
        orderBy: { createdAt: "asc" }
      }
    }
  });

  let totalDeleted = 0;

  for (const contract of contracts) {
    if (contract.tickets.length > 1) {
      console.log(`\nContrato: ${contract.contractNumber} (${contract.clientName})`);
      console.log(`Encontrados ${contract.tickets.length} tickets de contrato.`);

      // Ordenar por estatus (más avanzado primero) y luego por fecha de creación (más antiguo primero)
      const sortedTickets = [...contract.tickets].sort((a, b) => {
        const rankA = STATUS_RANK[a.status] || 0;
        const rankB = STATUS_RANK[b.status] || 0;
        
        if (rankB !== rankA) {
          return rankB - rankA; // Mayor ranking primero
        }
        
        return a.createdAt.getTime() - b.createdAt.getTime(); // Más antiguo primero
      });

      const ticketToKeep = sortedTickets[0];
      const ticketsToDelete = sortedTickets.slice(1);

      console.log(`-> Manteniendo ticket: ${ticketToKeep.ticketNumber} | Status: ${ticketToKeep.status} | Creado: ${ticketToKeep.createdAt.toISOString()}`);

      for (const t of ticketsToDelete) {
        console.log(`   x Eliminando ticket duplicado: ${t.ticketNumber} | Status: ${t.status} | Creado: ${t.createdAt.toISOString()}`);
        
        // 1. Eliminar los mensajes asociados al ticket para evitar violación de clave foránea
        await prisma.ticketMessage.deleteMany({
          where: { ticketId: t.id }
        });

        // 2. Eliminar el ticket
        await prisma.supportTicket.delete({
          where: { id: t.id }
        });

        totalDeleted++;
      }
    }
  }

  console.log(`\n--- LIMPIEZA FINALIZADA. TOTAL TICKETS ELIMINADOS: ${totalDeleted} ---`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
