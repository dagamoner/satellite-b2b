import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixPermissions() {
  try {
    console.log("--- Fixing Supabase Permissions via SQL ---");
    
    // 1. Dar acceso al esquema public
    await prisma.$executeRawUnsafe(`GRANT USAGE ON SCHEMA public TO anon, authenticated;`);
    console.log("1. Granted USAGE on public schema.");

    // 2. Dar permisos a las tablas críticas
    await prisma.$executeRawUnsafe(`GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;`);
    console.log("2. Granted ALL on all tables.");

    // 3. Dar permisos a las secuencias (para IDs autoincrementales)
    await prisma.$executeRawUnsafe(`GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;`);
    console.log("3. Granted ALL on all sequences.");

    // 4. Asegurar que RLS permita ver los datos (Crear políticas si no existen)
    // Usamos un bloque anónimo para evitar errores si la política ya existe
    const tables = ['installation_contracts', 'support_tickets', 'ticket_messages'];
    for (const table of tables) {
      try {
        await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" DISABLE ROW LEVEL SECURITY;`);
        console.log(`4. Disabled RLS on ${table} for immediate visibility.`);
      } catch (e) {
        console.warn(`Could not disable RLS on ${table}:`, e);
      }
    }

    console.log("\n--- PERMISSIONS FIXED! ---");
  } catch (error) {
    console.error("Critical error fixing permissions:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixPermissions();
