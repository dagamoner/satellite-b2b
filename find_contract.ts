import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const ticket = 'SOL-2026-0067';
  const contract = await prisma.installationContract.findFirst({
    where: {
      contractNumber: ticket
    }
  });

  console.log(JSON.stringify(contract, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
