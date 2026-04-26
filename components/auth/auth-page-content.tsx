import { LoginForm } from "@/components/auth/login-form";
import { AppLogo } from "@/components/shared/app-logo";
import { APP_NAME } from "@/lib/constants/app";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AuthPageContentProps = {
  mode: "admin" | "login" | "signup";
  nextPath?: string;
};

const PAGE_COPY = {
  admin: {
    formTitle: "Admin access",
    subtitle: "Sign in with an authorized account",
  },
  login: {
    formTitle: "Welcome back",
    subtitle: "Sign in to manage your bookings",
  },
  signup: {
    formTitle: "Create account",
    subtitle: "Save your booking requests and history",
  },
} as const;

export function AuthPageContent({ mode, nextPath }: AuthPageContentProps) {
  const copy = PAGE_COPY[mode];

  return (
    <main className="relative isolate flex min-h-[calc(100vh-4rem-1px)] items-center justify-center overflow-hidden px-4 py-12 md:px-6 md:py-16">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#fffdf9_0%,#fff8ef_46%,#fffdf9_100%)]" />
      <div className="absolute left-1/2 top-12 -z-10 h-64 w-[34rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(220,164,83,0.16)_0%,rgba(220,164,83,0)_68%)] blur-3xl" />

      <div className="w-full max-w-sm">
        <div className="mb-7 flex items-center justify-center gap-3">
          <AppLogo />
          <div className="leading-tight">
            <p className="font-display text-xl font-semibold text-[#3b2a20]">{APP_NAME}</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8d6f5e]">
              Event Venue
            </p>
          </div>
        </div>

        <section className="rounded-[var(--radius-md)] border border-[#e8d7c7] bg-[#fffdf9] p-7 shadow-[0_18px_42px_rgba(73,48,32,0.10)]">
          <CardHeader className="space-y-1 px-0 pb-6 pt-0 text-center">
            <CardTitle
              className="font-display text-3xl font-semibold leading-tight text-[#3b2a20]"
              data-butterfly-anchor={mode === "signup" ? "signup-title" : "login-title"}
            >
              {copy.formTitle}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{copy.subtitle}</p>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <LoginForm mode={mode} nextPath={nextPath} />
          </CardContent>
        </section>
      </div>
    </main>
  );
}
