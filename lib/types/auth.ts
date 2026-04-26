export type AuthProvider = "password";

export type AuthUser = {
  displayName: string;
  email: string;
  initials: string;
  phoneNumber?: string;
  providers: AuthProvider[];
};
