import { createClient } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = "https://gnulkgpthrklbkovwiay.supabase.co";
const DEFAULT_ANON_KEY = "sb_publishable_ZwUJMvgf4VnbAuhS8K4eoA_FzQUApSb";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY;

/** Public / client-safe Supabase client */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** Server-side Supabase client for Route Handlers */
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || supabaseUrl;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
