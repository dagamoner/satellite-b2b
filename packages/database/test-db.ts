import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const contracts = await prisma.installationContract.findMany({
    select: { contractNumber: true, status: true, clientSignature: true, techSignature: true }
  });
  console.log(JSON.stringify(contracts, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
