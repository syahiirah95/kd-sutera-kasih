import { cookies } from "next/headers";
import { type DemoMode, DEMO_MODE_COOKIE, isDemoMode } from "@/lib/constants/demo-mode";

export async function getDemoMode(): Promise<DemoMode> {
  const cookieStore = await cookies();
  const value = cookieStore.get(DEMO_MODE_COOKIE)?.value;

  if (value && isDemoMode(value)) {
    return value;
  }

  return "user";
}
