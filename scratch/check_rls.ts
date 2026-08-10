import pg from 'pg';

const connectionString = 'postgresql://postgres.gvjuegvbofpfhmvafhly:Donatto270619@aws-1-sa-east-1.pooler.supabase.com:5432/postgres';

async function main() {
  const client = new pg.Client({ connectionString });
  try {
    await client.connect();
    const res = await client.query("SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public'");
    console.log("RLS STATUS:", res.rows);
    
    // Check if there are any policies on support_tickets
    const policies = await client.query("SELECT * FROM pg_policies WHERE tablename = 'support_tickets'");
    console.log("POLICIES ON support_tickets:", policies.rows);
  } catch (error) {
    console.error("ERROR:", error);
  } finally {
    await client.end();
  }
}

main();
