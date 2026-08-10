import pg from 'pg';

const connectionString = 'postgresql://postgres.gvjuegvbofpfhmvafhly:Donatto270619@aws-1-sa-east-1.pooler.supabase.com:5432/postgres';

async function main() {
  const client = new pg.Client({ connectionString });
  try {
    await client.connect();
    const tables = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log("TABLES:", tables.rows.map(r => r.table_name));
    
    const tickets = await client.query('SELECT * FROM support_tickets LIMIT 1');
    console.log("TICKET SAMPLE KEYS:", Object.keys(tickets.rows[0] || {}));
    
    const columns = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'support_tickets'");
    console.log("SUPPORT_TICKETS COLUMNS:", columns.rows);
  } catch (error) {
    console.error("ERROR:", error);
  } finally {
    await client.end();
  }
}

main();
