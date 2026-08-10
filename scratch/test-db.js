const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const contract = await prisma.installationContract.findFirst();
  console.log("CONTRACT KEYS:", Object.keys(contract || {}));
}
main().catch(console.error).finally(() => prisma.$disconnect());
