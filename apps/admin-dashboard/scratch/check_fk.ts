import pg from 'pg';

async function main() {
  const client = new pg.Client({
    connectionString: "postgresql://postgres.gvjuegvbofpfhmvafhly:Donatto270619@aws-1-sa-east-1.pooler.supabase.com:5432/postgres"
  });

  try {
    await client.connect();
    
    const fks = await client.query(`
      SELECT
          tc.table_name, 
          kcu.column_name, 
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name 
      FROM 
          information_schema.table_constraints AS tc 
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
          JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY' 
      AND tc.table_name IN ('support_tickets', 'ticket_messages')
    `);
    console.log("Foreign Keys:", fks.rows);

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

main();
