import { createClient } from '@supabase/supabase-js';

// Usamos variables publicas seguras. En el admin, luego integramos la validación SSR de cookies.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
