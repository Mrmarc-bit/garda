import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

/** Public / client-safe Supabase client */
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);

/** Admin / server-side Supabase client for Route Handlers */
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || supabaseUrl;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseServiceKey || supabaseAnonKey;
  return createClient(url || "https://placeholder.supabase.co", key || "placeholder-key", {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
