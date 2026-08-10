import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Faltan variables de entorno de Supabase");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testQuery() {
  console.log("--- TEST DE CONSULTA SUPABASE ---");
  
  // Intento 1: Tal cual está en el código (con alias)
  console.log("\nProbando con alias 'contract:installation_contracts'...");
  const { data: d1, error: e1 } = await supabase
    .from("support_tickets")
    .select(`
      *,
      contract:installation_contracts (
        clientName,
        contractNumber
      )
    `)
    .limit(1);

  if (e1) {
    console.error("❌ Error en Intento 1:", e1.message);
  } else {
    console.log("✅ Intento 1 exitoso:", d1);
  }

  // Intento 2: Sin alias, usando el nombre de la tabla
  console.log("\nProbando sin alias 'installation_contracts'...");
  const { data: d2, error: e2 } = await supabase
    .from("support_tickets")
    .select(`
      *,
      installation_contracts (
        clientName,
        contractNumber
      )
    `)
    .limit(1);

  if (e2) {
    console.error("❌ Error en Intento 2:", e2.message);
  } else {
    console.log("✅ Intento 2 exitoso:", d2);
  }

  // Intento 3: Solo tickets sin relación
  console.log("\nProbando solo tickets...");
  const { data: d3, error: e3 } = await supabase
    .from("support_tickets")
    .select('*')
    .limit(5);

  if (e3) {
    console.error("❌ Error en Intento 3:", e3.message);
  } else {
    console.log(`✅ Intento 3 exitoso. Encontrados ${d3.length} tickets.`);
    console.table(d3.map(t => ({ id: t.id, number: t.ticketNumber, status: t.status })));
  }
}

testQuery();
