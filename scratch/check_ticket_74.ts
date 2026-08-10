import * as dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function check() {
  try {
    const tickets = await prisma.supportTicket.findMany({
      where: { contractId: "fc100995-f426-48cd-893d-402e25517ab3" },
    });
    console.log("=== TICKETS FOR CONTRACT ===");
    console.log(JSON.stringify(tickets, null, 2));
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

check();
