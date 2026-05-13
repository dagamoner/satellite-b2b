import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const ticket = 'SOL-2026-0067';
  const lead = await prisma.lead.findFirst({
    where: {
      ticketNumber: ticket
    }
  });

  console.log(JSON.stringify(lead, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
