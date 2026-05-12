import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { prisma } from "../packages/database/src/client";

console.log("DATABASE_URL loaded:", process.env.DATABASE_URL ? "YES (masked)" : "NO");
if (process.env.DATABASE_URL) {
  const url = new URL(process.env.DATABASE_URL);
  console.log("DB Protocol:", url.protocol);
  console.log("DB Host:", url.host);
  console.log("DB User:", url.username);
  console.log("DB Password length:", url.password.length);
  
  // Test Pool directly
  const { Pool } = require('pg');
  const pool = new Pool({
    user: url.username,
    password: url.password,
    host: url.hostname,
    port: parseInt(url.port),
    database: url.pathname.slice(1),
    ssl: { rejectUnauthorized: false }
  });
  
  pool.query('SELECT NOW()', (err: any, res: any) => {
    if (err) console.error("Direct Pool Error:", err);
    else console.log("Direct Pool Success:", res.rows[0]);
    pool.end();
  });
}

async function check() {
  try {
    const contracts = await prisma.installationContract.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });
    console.log("Last 5 Contracts:");
    contracts.forEach(c => console.log(`- ${c.contractNumber} (${c.status}): ${c.clientName}`));

    const tickets = await prisma.supportTicket.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { contract: true }
    });
    console.log("\nLast 5 Support Tickets:");
    tickets.forEach(t => console.log(`- ${t.ticketNumber} [Contract: ${t.contract.contractNumber}]: ${t.title}`));

  } catch (error) {
    console.error("DB Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

check();
