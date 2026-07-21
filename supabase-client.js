codex/connect-lazo-mercado-2.0-with-supabase-upgf0r
window.lazoSupabase = window.supabase.createClient(
  window.APP_CONFIG.SUPABASE_URL,
  window.APP_CONFIG.SUPABASE_PUBLISHABLE_KEY
);

window.supabaseClient = window.lazoSupabase;
window.supabaseClient = window.supabase.createClient(
  window.APP_CONFIG.SUPABASE_URL,
  window.APP_CONFIG.SUPABASE_PUBLISHABLE_KEY
);
 main
