"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const COPY = {
  admin: {
    description: "Sign in with an authorized admin account or request admin access.",
    title: "Admin access",
  },
  login: {
    description: "Sign in to manage your bookings.",
    title: "Welcome back",
  },
  signup: {
    description: "Create an account to save your booking requests and history.",
    title: "Create account",
  },
} as const;

function getAuthMode(value: string | null) {
  return value === "admin" || value === "login" || value === "signup"
    ? value
    : null;
}

export function AuthDialog() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = getAuthMode(searchParams.get("auth"));
  const nextPath = searchParams.get("next") ?? pathname;

  const closeDialog = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("auth");
    params.delete("next");
    params.delete("switch");

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const copy = mode ? COPY[mode] : null;

  return (
    <Dialog open={Boolean(mode)} onOpenChange={(open) => {
      if (!open) {
        closeDialog();
      }
    }}>
      <DialogContent className="w-[min(92vw,26rem)] rounded-[var(--radius-md)]">
        {copy && mode ? (
          <>
            <DialogHeader className="pb-2 pr-0 text-center">
              <DialogTitle className="mx-auto max-w-[15rem] text-center font-display text-3xl">
                <span
                  className="inline-flex items-center"
                  data-butterfly-anchor={mode === "signup" ? "signup-title" : "login-title"}
                >
                  {copy.title}
                </span>
              </DialogTitle>
              <DialogDescription className="mx-auto max-w-[20rem] text-center">
                {copy.description}
              </DialogDescription>
            </DialogHeader>
            <LoginForm
              mode={mode}
              nextPath={mode === "admin" ? "/admin" : nextPath}
            />
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
