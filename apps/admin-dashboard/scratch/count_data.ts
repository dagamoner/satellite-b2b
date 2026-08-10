import pg from 'pg';

async function main() {
  const client = new pg.Client({
    connectionString: "postgresql://postgres.gvjuegvbofpfhmvafhly:Donatto270619@aws-1-sa-east-1.pooler.supabase.com:5432/postgres"
  });

  try {
    await client.connect();
    
    const tickets = await client.query(`SELECT COUNT(*) FROM support_tickets`);
    console.log("Total tickets:", tickets.rows[0].count);

    const messages = await client.query(`SELECT COUNT(*) FROM ticket_messages`);
    console.log("Total messages:", messages.rows[0].count);

    const contracts = await client.query(`SELECT COUNT(*) FROM installation_contracts`);
    console.log("Total contracts:", contracts.rows[0].count);

    if (parseInt(tickets.rows[0].count) > 0) {
        const lastTicket = await client.query(`SELECT * FROM support_tickets ORDER BY "createdAt" DESC LIMIT 1`);
        console.log("Last ticket:", lastTicket.rows[0]);
    }

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

main();
