import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function disableRls() {
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
        console.log(`Disabling RLS on ${table}...`);
        await client.query(`ALTER TABLE "${table}" DISABLE ROW LEVEL SECURITY;`);
      }
    }

    console.log("Successfully disabled RLS on all tables.");
  } catch (error) {
    console.error("Error disabling RLS:", error);
  } finally {
    await client.end();
  }
}

disableRls();
