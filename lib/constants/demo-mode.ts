export const DEMO_MODE_COOKIE = "kd-demo-view";

export const DEMO_MODE_LABELS = {
  admin: "Admin View",
  user: "User View",
} as const;

export type DemoMode = keyof typeof DEMO_MODE_LABELS;

export function isDemoMode(value: string): value is DemoMode {
  return value === "admin" || value === "user";
}
