import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function checkStorage() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    
    // Check buckets
    const buckets = await client.query('SELECT id, name, public FROM storage.buckets');
    console.log("Buckets:", buckets.rows);

    // Check policies on storage.objects
    const policies = await client.query(`
      SELECT policyname, permissive, roles, cmd, qual, with_check 
      FROM pg_policies 
      WHERE schemaname = 'storage' AND tablename = 'objects';
    `);
    console.log("Policies on storage.objects:", policies.rows);

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.end();
  }
}

checkStorage();
