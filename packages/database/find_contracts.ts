import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const contracts = await prisma.installationContract.findMany({
    where: {
      technicianId: "d44743c2-3607-4f57-9cb6-a0e2b0690a3e"
    },
    include: {
      technician: true
    }
  });
  console.log("Found contracts count:", contracts.length);
  console.log(JSON.stringify(contracts, null, 2));
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
