import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const contractId = "fc100995-f426-48cd-893d-402e25517ab3";

  // Generamos un string base64 falso para la firma del técnico para que pueda pasar la validación
  const fakeTechSignature = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

  await prisma.installationContract.update({
    where: { id: contractId },
    data: {
      status: "SIGNATURE_PENDING",
      installedAt: null,
      clientSignedAt: null,
      clientSignature: null,
      techSignature: fakeTechSignature,
      techName: "Técnico Pruebas",
      techDni: "12345678"
    }
  });

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
        content: "EL SISTEMA HA CORREGIDO EL ESTADO A: SIGNATURE PENDING (Tech signature added)",
        authorId: null,
      }
    });
  }

  console.log("✅ Contrato SOL-2026-0074 reseteado con techSignature.");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
