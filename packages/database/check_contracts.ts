import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const contracts = await prisma.installationContract.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  console.log(JSON.stringify(contracts, null, 2));
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
