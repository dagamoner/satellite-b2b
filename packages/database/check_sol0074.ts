import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Buscar contrato SOL-2026-0074
  const contract = await prisma.installationContract.findFirst({
    where: { contractNumber: "SOL-2026-0074" },
  });
  
  if (!contract) {
    console.log("Contrato SOL-2026-0074 no encontrado");
    return;
  }

  console.log("=== CONTRATO SOL-2026-0074 ===");
  console.log("ID:", contract.id);
  console.log("Status:", contract.status);
  console.log("techSignature:", contract.techSignature ? `[EXISTE - ${contract.techSignature.length} chars]` : "NULL/VACÍO");
  console.log("clientSignature:", contract.clientSignature ? `[EXISTE - ${contract.clientSignature.length} chars]` : "NULL/VACÍO");
  console.log("techName:", contract.techName);
  console.log("techDni:", contract.techDni);
  console.log("techSignedAt:", contract.techSignedAt);
  console.log("clientSignedAt:", contract.clientSignedAt);
  console.log("clientName:", contract.clientName);
  console.log("clientDni:", contract.clientDni);
  console.log("installedAt:", contract.installedAt);

  // Buscar tickets asociados
  const tickets = await prisma.supportTicket.findMany({
    where: { contractId: contract.id },
    include: {
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 5
      }
    }
  });

  console.log("\n=== TICKETS ASOCIADOS ===");
  for (const t of tickets) {
    console.log(`\nTicket: ${t.ticketNumber} (${t.id})`);
    console.log("  Status:", t.status);
    console.log("  Title:", t.title);
    console.log("  Category:", t.category);
    console.log("  Últimos mensajes:");
    for (const m of t.messages) {
      console.log(`    - [${m.createdAt.toISOString()}] ${m.content.substring(0, 100)}`);
    }
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
