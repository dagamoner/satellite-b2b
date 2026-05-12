import pg from 'pg';

async function main() {
  const client = new pg.Client({
    connectionString: "postgresql://postgres.gvjuegvbofpfhmvafhly:Donatto270619@aws-1-sa-east-1.pooler.supabase.com:5432/postgres"
  });

  try {
    await client.connect();
    
    const tables = ['support_tickets', 'ticket_messages', 'installation_contracts', 'users'];
    for (const table of tables) {
      const columns = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = $1
      `, [table]);
      console.log(`Columns for ${table}:`, columns.rows.map(r => r.column_name));
    }

    const sampleTicket = await client.query(`SELECT * FROM support_tickets LIMIT 1`);
    console.log("Sample Ticket Keys:", Object.keys(sampleTicket.rows[0] || {}));

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

main();
