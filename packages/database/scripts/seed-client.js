const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const contract = await prisma.installationContract.upsert({
    where: { contractNumber: "MR-2026-0001" },
    update: {},
    create: {
      contractNumber: "MR-2026-0001",
      clientName: "Juan Perez",
      clientEmail: "juan@example.com",
      clientPhone: "2611234567",
      clientDni: "12345678",
      address: "Calle Falsa 123",
      equipmentType: "Starlink V2",
      planType: "Residencial",
      status: "ACTIVE",
    },
  });

  console.log("Test contract created:", contract.contractNumber);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
