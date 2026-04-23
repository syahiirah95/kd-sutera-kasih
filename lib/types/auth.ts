export type AuthProvider = "google" | "password";

export type AuthUser = {
  displayName: string;
  email: string;
  initials: string;
  providers: AuthProvider[];
};
