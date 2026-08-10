const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const contracts = await prisma.installationContract.findMany({
      take: 1
    });
    console.log('Successfully queried installation_contracts:', contracts.length);
  } catch (error) {
    console.error('Error querying installation_contracts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
