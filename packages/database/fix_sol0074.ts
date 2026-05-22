import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const contractId = "fc100995-f426-48cd-893d-402e25517ab3";

  // 1. Revertir el contrato a SIGNATURE_PENDING
  await prisma.installationContract.update({
    where: { id: contractId },
    data: {
      status: "SIGNATURE_PENDING",
      installedAt: null,       // No fue realmente instalado/completado
      clientSignedAt: null,
    }
  });

  // 2. Revertir todos los tickets asociados a SIGNATURE_PENDING
  const tickets = await prisma.supportTicket.findMany({
    where: { contractId }
  });

  for (const t of tickets) {
    await prisma.supportTicket.update({
      where: { id: t.id },
      data: {
        status: "SIGNATURE_PENDING",
        updatedAt: new Date()
      }
    });

    await prisma.ticketMessage.create({
      data: {
        ticketId: t.id,
        content: "EL SISTEMA HA CORREGIDO EL ESTADO A: SIGNATURE PENDING (se requiere firma del cliente)",
        authorId: null,
      }
    });
  }

  console.log("✅ Contrato SOL-2026-0074 revertido a SIGNATURE_PENDING");
  console.log(`   - ${tickets.length} ticket(s) actualizados`);

  // Verificar el estado final
  const contract = await prisma.installationContract.findUnique({
    where: { id: contractId }
  });
  console.log("   - Contract status:", contract?.status);
  console.log("   - techSignature:", contract?.techSignature ? "EXISTE" : "NULL");
  console.log("   - clientSignature:", contract?.clientSignature ? "EXISTE" : "NULL");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
