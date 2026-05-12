import pg from 'pg';

async function main() {
  const client = new pg.Client({
    connectionString: "postgresql://postgres.gvjuegvbofpfhmvafhly:Donatto270619@aws-1-sa-east-1.pooler.supabase.com:5432/postgres"
  });

  try {
    await client.connect();
    
    console.log("--- support_tickets ---");
    const tickets = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'support_tickets'
    `);
    console.log(tickets.rows.map(r => r.column_name));

    console.log("--- ticket_messages ---");
    const messages = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'ticket_messages'
    `);
    console.log(messages.rows.map(r => r.column_name));

    console.log("--- installation_contracts ---");
    const contracts = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'installation_contracts'
    `);
    console.log(contracts.rows.map(r => r.column_name));

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

main();
