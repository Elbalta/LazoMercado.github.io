(function initializeSupabase() {
  const config = window.APP_CONFIG;
  if (!config?.SUPABASE_URL || !config?.SUPABASE_PUBLISHABLE_KEY) {
    throw new Error('Falta la configuración pública de Supabase.');
  }
  if (!window.supabase?.createClient) {
    throw new Error('No fue posible cargar la biblioteca de Supabase.');
  }
  window.lazoSupabase = window.supabase.createClient(
    config.SUPABASE_URL,
    config.SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  );
})();
