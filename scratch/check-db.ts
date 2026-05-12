import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("--- DIAGNÓSTICO DE BASE DE DATOS ---");
  
  const totalContracts = await prisma.installationContract.count();
  console.log(`Total de contratos en DB: ${totalContracts}`);

  const lastContracts = await prisma.installationContract.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      contractNumber: true,
      clientName: true,
      status: true,
      createdAt: true
    }
  });

  console.log("\nÚltimos 5 contratos:");
  console.table(lastContracts);

  const sol50 = await prisma.installationContract.findFirst({
    where: { contractNumber: "SOL-2026-0050" }
  });

  if (sol50) {
    console.log("\n✅ Registro SOL-2026-0050 ENCONTRADO:");
    console.log(JSON.stringify(sol50, null, 2));
  } else {
    console.log("\n❌ Registro SOL-2026-0050 NO ENCONTRADO en la base de datos.");
  }

  const openTickets = await prisma.supportTicket.count({
    where: { status: "OPEN" }
  });
  console.log(`\nTickets en estado OPEN: ${openTickets}`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
