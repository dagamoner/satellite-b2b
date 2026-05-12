import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gvjuegvbofpfhmvafhly.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_xxcF9VmJQIX0lOgQvLNUfA_1GzgBFiR';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testRLS() {
    console.log("--- Testing RLS for installation_contracts ---");
    const { data: contracts, error: err1 } = await supabase.from('installation_contracts').select('count');
    if (err1) console.error("Error contracts:", err1);
    else console.log("Contracts found with Anon Key:", contracts);

    console.log("\n--- Testing RLS for support_tickets ---");
    const { data: tickets, error: err2 } = await supabase.from('support_tickets').select('count');
    if (err2) console.error("Error tickets:", err2);
    else console.log("Tickets found with Anon Key:", tickets);
}

testRLS();
