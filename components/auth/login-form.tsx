"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { TurnstileWidget } from "@/components/auth/turnstile-widget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { createSupabaseBrowserClient } from "@/lib/auth/client";

type LoginFormMode = "admin" | "login" | "signup";
const AUTH_REDIRECT_PATH = "/venue";
const AUTH_PRIMARY_BUTTON_CLASS =
  "booking-form-nav-primary !h-10 !w-full !rounded-lg !border !border-[#c8893e]/55 !bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] !px-3 !text-sm !font-semibold !leading-none !text-white shadow-[0_8px_20px_rgba(184,111,41,0.24)] disabled:!border-[#b8afa8]/55 disabled:!bg-[linear-gradient(135deg,#d7d2cc_0%,#b9b1aa_100%)] disabled:!text-[#6f665f] disabled:!opacity-100 disabled:!shadow-[0_5px_12px_rgba(80,72,64,0.12)]";

function getAuthErrorMessage(error: { message?: string } | null) {
  const message = error?.message?.trim();

  if (!message || message === "{}") {
    return "Unable to continue. Please check your Supabase Auth settings and try again.";
  }

  if (message.toLowerCase().includes("captcha")) {
    return "Supabase Auth is requiring CAPTCHA. Disable CAPTCHA for this demo or add CAPTCHA verification to the form.";
  }

  if (message.toLowerCase().includes("missing email or phone")) {
    return "Please enter your email address.";
  }

  return message;
}

export function LoginForm({
  mode = "login",
  nextPath,
}: Readonly<{
  mode?: LoginFormMode;
  nextPath?: string;
}>) {
  const router = useRouter();
  const { toast } = useToast();
  const siteKey = process.env.NEXT_PUBLIC_CF_TURNSTILE_SITEKEY;
  const [captchaResetKey, setCaptchaResetKey] = useState(0);
  const [captchaToken, setCaptchaToken] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRequestingAdmin, setIsRequestingAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const redirectPath = nextPath?.startsWith("/") && !nextPath.startsWith("//")
    ? nextPath
    : AUTH_REDIRECT_PATH;

  async function completeAuth() {
    if (mode === "admin") {
      const response = await fetch("/api/admin/check");
      const result = (await response.json().catch(() => null)) as {
        isAdmin?: boolean;
      } | null;

      if (!result?.isAdmin) {
        toast({
          message: "This account is not on the admin list. So close, yet so not admin.",
          title: "Oh no",
          variant: "error",
        });
        return;
      }

      await fetch("/api/demo-mode", {
        body: JSON.stringify({ mode: "admin" }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
    }

    router.push(redirectPath);
    router.refresh();
  }

  async function signInWithEmail() {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      toast({
        message: "Supabase is not configured, so sign in is having a dramatic moment.",
        title: "Oh no",
        variant: "error",
      });
      return;
    }

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) {
      toast({
        message: "Please enter your email address.",
        title: "Oh no",
        variant: "error",
      });
      return;
    }

    if (!trimmedPassword) {
      toast({
        message: "Please enter your password.",
        title: "Oh no",
        variant: "error",
      });
      return;
    }

    if (siteKey && !captchaToken) {
      toast({
        message: "Please complete the security check before continuing.",
        title: "Oh no",
        variant: "error",
      });
      return;
    }

    setIsLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      options: {
        captchaToken: captchaToken || undefined,
      },
      password: trimmedPassword,
    });

    setIsLoading(false);

    if (signInError) {
      toast({
        message: getAuthErrorMessage(signInError),
        title: "Oh no",
        variant: "error",
      });
      setCaptchaToken("");
      setCaptchaResetKey((current) => current + 1);
      return;
    }

    toast({
      message: "There you are. We were starting to miss you.",
      title: "Welcome back",
      variant: "success",
    });

    await completeAuth();
  }

  async function signUpWithEmail() {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      toast({
        message: "Supabase is not configured, so sign up is currently being a diva.",
        title: "Oh no",
        variant: "error",
      });
      return;
    }

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) {
      toast({
        message: "Please enter your email address.",
        title: "Oh no",
        variant: "error",
      });
      return;
    }

    if (!trimmedPassword) {
      toast({
        message: "Please enter your password.",
        title: "Oh no",
        variant: "error",
      });
      return;
    }

    if (siteKey && !captchaToken) {
      toast({
        message: "Please complete the security check before continuing.",
        title: "Oh no",
        variant: "error",
      });
      return;
    }

    setIsLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email: trimmedEmail,
      options: {
        captchaToken: captchaToken || undefined,
        emailRedirectTo: `${window.location.origin}${redirectPath}`,
      },
      password: trimmedPassword,
    });

    setIsLoading(false);

    if (signUpError) {
      toast({
        message: getAuthErrorMessage(signUpError),
        title: "Oh no",
        variant: "error",
      });
      setCaptchaToken("");
      setCaptchaResetKey((current) => current + 1);
      return;
    }

    toast({
      message: "Fresh account energy unlocked. Check your email if confirmation is enabled.",
      title: "You are in",
      variant: "success",
    });
    router.push(redirectPath);
    router.refresh();
  }

  async function requestAdminAccess() {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      toast({
        message: "Supabase is not configured, so that request had absolutely nowhere to go.",
        title: "Oh no",
        variant: "error",
      });
      return;
    }

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      toast({
        message: "Enter your email and password first so we can attach the request to your account.",
        title: "Oh no",
        variant: "error",
      });
      return;
    }

    setIsRequestingAdmin(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password: trimmedPassword,
    });

    if (signInError) {
      setIsRequestingAdmin(false);
      toast({
        message: getAuthErrorMessage(signInError),
        title: "Oh no",
        variant: "error",
      });
      return;
    }

    const response = await fetch("/api/admin/requests", {
      method: "POST",
    });
    const result = (await response.json().catch(() => null)) as {
      error?: string;
      request?: { status?: string };
    } | null;

    setIsRequestingAdmin(false);

    if (!response.ok) {
      toast({
        message: result?.error ?? "Unable to submit admin request.",
        title: "Oh no",
        variant: "error",
      });
      return;
    }

    toast({
      message:
        result?.request?.status === "approved"
          ? "Plot twist: this account already has admin access."
          : "Your admin request is in. Time to look politely ambitious.",
      title: "Request sent",
      variant: "success",
    });

    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4">
        <div className="grid gap-1.5">
          <Label className="text-[13px]" htmlFor="email">Email address</Label>
          <Input
            className="h-10 rounded-lg border-[#e4d3c4] bg-[#fffdf9] px-3 text-sm"
            id="email"
            placeholder="you@example.com"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="grid gap-1.5">
          <Label className="text-[13px]" htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              className="h-10 rounded-lg border-[#e4d3c4] bg-[#fffdf9] px-3 pr-11 text-sm"
              id="password"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center justify-center text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => setShowPassword((current) => !current)}
              type="button"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>
      </div>
      <TurnstileWidget
        key={captchaResetKey}
        resetKey={captchaResetKey}
        siteKey={siteKey}
        onToken={setCaptchaToken}
        onError={() => {
          setCaptchaToken("");
          toast({
            message: "The security check refused to cooperate. Please refresh and try again.",
            title: "Oh no",
            variant: "error",
          });
        }}
      />
      <div className="flex flex-wrap items-center gap-2">
        <Button
          className={AUTH_PRIMARY_BUTTON_CLASS}
          disabled={isLoading || isRequestingAdmin}
          onClick={mode === "signup" ? signUpWithEmail : signInWithEmail}
        >
          {isLoading ? "Working" : mode === "signup" ? "Sign up" : "Sign in"}
        </Button>
        {mode === "admin" ? (
          <Button
            className="!h-10 !w-full !rounded-lg !border !border-[#c9a27e]/45 !bg-[linear-gradient(135deg,rgba(255,255,255,0.78)_0%,rgba(246,226,207,0.72)_100%)] !px-3 !text-sm !font-semibold !leading-none !text-[#5f3f2f] shadow-[0_6px_16px_rgba(114,76,43,0.12)] hover:!border-[#c8893e]/70 hover:!bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] hover:!text-white"
            disabled={isLoading || isRequestingAdmin}
            onClick={requestAdminAccess}
            variant="secondary"
          >
            {isRequestingAdmin ? "Requesting" : "Request to be an admin"}
          </Button>
        ) : null}
      </div>
      {mode !== "admin" ? (
        <p className="text-center text-sm text-muted-foreground">
          {mode === "signup" ? "Already have an account?" : "New to Sutera Kasih Hall?"}{" "}
          <Link
            className="font-semibold text-[#bf762f] transition hover:text-[#8d542d]"
            href={mode === "signup" ? "/login" : "/signup"}
          >
            {mode === "signup" ? "Sign in" : "Create an account"}
          </Link>
        </p>
      ) : null}
    </div>
  );
}
