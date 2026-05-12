import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const tables = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log("TABLES:", tables);
    
    const tickets = await prisma.supportTicket.findMany({
      include: {
        contract: true
      },
      take: 5
    });
    console.log("TICKETS SAMPLE:", JSON.stringify(tickets, null, 2));
  } catch (error) {
    console.error("ERROR:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
