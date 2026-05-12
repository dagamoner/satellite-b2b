import pg from 'pg';

async function main() {
  const client = new pg.Client({
    connectionString: "postgresql://postgres.gvjuegvbofpfhmvafhly:Donatto270619@aws-1-sa-east-1.pooler.supabase.com:5432/postgres"
  });

  try {
    await client.connect();
    
    const rls = await client.query(`
      SELECT relname, relrowsecurity 
      FROM pg_class 
      JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace 
      WHERE nspname = 'public' 
      AND relname IN ('support_tickets', 'ticket_messages', 'installation_contracts', 'users')
    `);
    console.log("RLS Status (true means enabled):", rls.rows);

    const policies = await client.query(`
      SELECT * FROM pg_policies 
      WHERE schemaname = 'public' 
      AND tablename IN ('support_tickets', 'ticket_messages', 'installation_contracts', 'users')
    `);
    console.log("Policies:", policies.rows);

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

main();
