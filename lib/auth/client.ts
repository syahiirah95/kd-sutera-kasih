"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv, isSupabaseConfigured } from "@/lib/auth/env";

export function createSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const { anonKey, url } = getSupabaseEnv();
  return createBrowserClient(url!, anonKey!);
}
