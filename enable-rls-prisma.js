import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function enableRlsPrisma() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log("Connected to database.");

    await client.query(`ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;`);

    console.log("Successfully enabled RLS on _prisma_migrations.");
  } catch (error) {
    console.error("Error enabling RLS:", error);
  } finally {
    await client.end();
  }
}

enableRlsPrisma();
