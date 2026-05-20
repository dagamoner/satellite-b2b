import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function setupStorage() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log("Connected to database.");

    // 1. Crear el bucket si no existe (public = false para que sea privado)
    await client.query(`
      INSERT INTO storage.buckets (id, name, public)
      VALUES ('contratos-evidencia', 'contratos-evidencia', false)
      ON CONFLICT (id) DO UPDATE SET public = false;
    `);
    console.log("Bucket 'contratos-evidencia' creado y configurado como PRIVADO.");

    // 2. RLS ya está habilitado por defecto en storage.objects en Supabase, omitimos el ALTER TABLE


    // 3. Eliminar politicas anteriores si existen para empezar limpio
    await client.query(`DROP POLICY IF EXISTS "Permitir subida anonima a contratos-evidencia" ON storage.objects;`);
    await client.query(`DROP POLICY IF EXISTS "Denegar lectura publica a contratos-evidencia" ON storage.objects;`);

    // 4. Crear política: Permitir a 'anon' y 'authenticated' hacer INSERT (subir archivos)
    // El cliente desde el portal usa la 'anon' key para subir las fotos al llenar el formulario
    await client.query(`
      CREATE POLICY "Permitir subida anonima a contratos-evidencia" 
      ON storage.objects FOR INSERT 
      TO public
      WITH CHECK ( bucket_id = 'contratos-evidencia' );
    `);
    console.log("Política de subida (INSERT) creada exitosamente.");

    // NOTA: No creamos política de SELECT para 'anon'. 
    // Esto significa que NADIE puede descargar ni ver las fotos de forma pública.
    // El panel de administrador (Backend) podrá verlas porque usa el Service Role Key (que ignora RLS)
    // o porque genera URLs firmadas (Signed URLs).

    console.log("¡Storage configurado de forma ultra-segura exitosamente!");

  } catch (error) {
    console.error("Error configurando storage:", error);
  } finally {
    await client.end();
  }
}

setupStorage();
