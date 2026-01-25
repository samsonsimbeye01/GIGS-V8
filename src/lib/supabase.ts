import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL as string | undefined;
const publishableKey = (import.meta as any).env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
const anonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY as string | undefined;

const key = publishableKey || anonKey;
const hasEnv = !!(supabaseUrl && key);
if (!hasEnv) {
  console.warn('Missing Supabase env vars VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Using placeholder client for preview.');
}

export const supabase = createClient(
  hasEnv ? supabaseUrl! : 'https://example.supabase.co',
  hasEnv ? key! : 'example-public-anon-key'
);
