import { createClient } from '@supabase/supabase-js';

// Usamos las variables de entorno de Next.js
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("⚠️ Supabase configuration missing! Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY env vars.");
}

export const supabase = createClient(
  supabaseUrl || 'https://mock.supabase.co', 
  supabaseKey || 'mock-anon-key'
);
