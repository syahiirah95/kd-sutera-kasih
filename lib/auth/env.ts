export function getSupabaseEnv() {
  return {
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  };
}

export function isSupabaseConfigured() {
  const { anonKey, url } = getSupabaseEnv();
  return Boolean(anonKey && url);
}
