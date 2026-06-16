import { createClient } from "@supabase/supabase-js";

export const BUCKET = "generated-images";

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase env vars are not configured");
  return createClient(url, key, { auth: { persistSession: false } });
}
