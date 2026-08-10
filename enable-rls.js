import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function enableRls() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log("Connected to database.");

    const res = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public';
    `);

    const tables = res.rows.map(r => r.tablename);
    console.log(`Found ${tables.length} tables in public schema.`);

    for (const table of tables) {
      if (table !== '_prisma_migrations') {
        console.log(`Enabling RLS on ${table}...`);
        await client.query(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;`);
      }
    }

    console.log("Successfully enabled RLS on all tables.");
  } catch (error) {
    console.error("Error enabling RLS:", error);
  } finally {
    await client.end();
  }
}

enableRls();
