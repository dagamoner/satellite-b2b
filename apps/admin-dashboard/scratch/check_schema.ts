import { prisma } from "../../../packages/database/src/client";

async function main() {
  try {
    const ticketsColumns = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'support_tickets'
    `;
    console.log("Columns for support_tickets:", ticketsColumns);

    const messagesColumns = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'ticket_messages'
    `;
    console.log("Columns for ticket_messages:", messagesColumns);

    const contractsColumns = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'installation_contracts'
    `;
    console.log("Columns for installation_contracts:", contractsColumns);

  } catch (error) {
    console.error("Error checking schema:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
