import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseEnv, isSupabaseConfigured } from "@/lib/auth/env";
import { MOCK_AUTH_USER } from "@/lib/auth/mock";
import type { AuthProvider, AuthUser } from "@/lib/types/auth";

export async function createSupabaseServerClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const cookieStore = await cookies();
  const { anonKey, url } = getSupabaseEnv();

  return createServerClient(url!, anonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, options, value }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          return;
        }
      },
    },
  });
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return MOCK_AUTH_USER;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return null;
  }

  const fullName =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.email.split("@")[0];
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((segment: string) => segment[0]?.toUpperCase() ?? "")
    .join("");
  const providers = ((user.app_metadata?.providers as string[] | undefined) ?? ["password"])
    .map(() => "password") as AuthProvider[];
  const phoneNumber =
    user.phone ??
    user.user_metadata?.phone ??
    user.user_metadata?.phone_number ??
    user.user_metadata?.phoneNumber;

  return {
    displayName: fullName,
    email: user.email,
    initials: initials || "KD",
    phoneNumber,
    providers,
  };
}
