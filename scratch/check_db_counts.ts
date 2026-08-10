import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function checkCounts() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log("Connected to database.");

    // Query tickets count
    const ticketsRes = await client.query('SELECT COUNT(*)::integer as count FROM support_tickets;');
    console.log(`Total support_tickets: ${ticketsRes.rows[0].count}`);

    // Query leads count
    const leadsRes = await client.query('SELECT COUNT(*)::integer as count FROM crm_leads;');
    console.log(`Total crm_leads: ${leadsRes.rows[0].count}`);

    // Query installation contracts count
    const contractsRes = await client.query('SELECT COUNT(*)::integer as count FROM installation_contracts;');
    console.log(`Total installation_contracts: ${contractsRes.rows[0].count}`);

    // Print count of tickets by status
    const ticketsStatus = await client.query('SELECT status, COUNT(*) FROM support_tickets GROUP BY status;');
    console.log("\nSupport Tickets by status:");
    console.table(ticketsStatus.rows);

    // Print first 5 tickets
    const firstTickets = await client.query('SELECT id, "ticketNumber", title, status, priority FROM support_tickets LIMIT 5;');
    console.log("\nFirst 5 Support Tickets:");
    console.table(firstTickets.rows);

    // Print first 5 leads
    const firstLeads = await client.query('SELECT id, "leadNumber", "clientName", status FROM crm_leads LIMIT 5;');
    console.log("\nFirst 5 Leads:");
    console.table(firstLeads.rows);

  } catch (error) {
    console.error("Error checking db:", error);
  } finally {
    await client.end();
  }
}

checkCounts();
