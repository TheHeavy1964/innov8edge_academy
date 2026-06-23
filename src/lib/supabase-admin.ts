import { createClient } from "@supabase/supabase-js";

// Admin client — uses service role key, NEVER expose to the client
// This is only used in server-side API routes (webhooks, etc.)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
