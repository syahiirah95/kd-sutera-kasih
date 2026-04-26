"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { Eye, EyeOff } from "lucide-react";
import { AccountInfoDialog } from "@/components/account/account-info-dialog";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { type DemoMode } from "@/lib/constants/demo-mode";
import { createSupabaseBrowserClient } from "@/lib/auth/client";
import type { AuthUser } from "@/lib/types/auth";

type ProfileMenuProps = {
  currentMode: DemoMode;
  user: AuthUser;
};

type AdminDialogView = "login" | "request";
const ADMIN_ACCESS_PASSWORD_HINT = "kdsuterahall2026!";

export function ProfileMenu({ currentMode, user }: ProfileMenuProps) {
  const router = useRouter();
  const { toast } = useToast();
  const menuRef = useRef<HTMLDivElement>(null);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [adminDialogView, setAdminDialogView] = useState<AdminDialogView>("login");
  const [adminPassword, setAdminPassword] = useState("");
  const [accountInfoOpen, setAccountInfoOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [requestEmail, setRequestEmail] = useState(user.email);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isSubmittingAdminDialog, setIsSubmittingAdminDialog] = useState(false);

  const pauseForToast = () => new Promise((resolve) => {
    window.setTimeout(resolve, 140);
  });

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const handleModeChange = (mode: DemoMode) => {
    startTransition(async () => {
      const response = await fetch("/api/demo-mode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      });

      if (!response.ok) {
        toast({
          message: "We couldn't switch your account mode right now. A little inconvenient, honestly.",
          title: "Oh no",
          variant: "error",
        });
        return;
      }

      toast({
        message: mode === "admin" ? "Admin mode is live. Power looks good on you." : "Back to user mode. Calm, elegant, responsible.",
        title: mode === "admin" ? "Admin mode on" : "User mode on",
        variant: "success",
      });

      router.refresh();
    });
  };

  const openAdminDialog = async () => {
    setAdminPassword(ADMIN_ACCESS_PASSWORD_HINT);
    setRequestEmail(user.email);
    setShowAdminPassword(false);
    setAdminDialogOpen(true);
    setIsSubmittingAdminDialog(true);

    const response = await fetch("/api/admin/check");
    const result = (await response.json().catch(() => null)) as {
      isAdmin?: boolean;
    } | null;

    setAdminDialogView(result?.isAdmin ? "login" : "request");
    setIsSubmittingAdminDialog(false);
  };

  const handleAdminToggle = () => {
    if (currentMode === "admin") {
      handleModeChange("user");
      return;
    }

    void openAdminDialog();
  };

  const handleAdminAccessLogin = () => {
    startTransition(async () => {
      setIsSubmittingAdminDialog(true);

      const response = await fetch("/api/admin/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: adminPassword }),
      });
      const result = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        setIsSubmittingAdminDialog(false);
        toast({
          message: result?.error ?? "Unable to verify the admin access password.",
          title: "Oh no",
          variant: "error",
        });
        return;
      }

      await fetch("/api/demo-mode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "admin" }),
      });

      setAdminDialogOpen(false);
      setIsSubmittingAdminDialog(false);
      toast({
        message: "You are in. Admin mode is ready and feeling very important.",
        title: "Admin mode unlocked",
        variant: "success",
      });
      router.refresh();
    });
  };

  const handleAdminRequest = () => {
    startTransition(async () => {
      setIsSubmittingAdminDialog(true);

      const response = await fetch("/api/admin/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: requestEmail }),
      });
      const result = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        setIsSubmittingAdminDialog(false);
        toast({
          message: result?.error ?? "Unable to submit your admin request.",
          title: "Oh no",
          variant: "error",
        });
        return;
      }

      setIsSubmittingAdminDialog(false);
      setAdminDialogOpen(false);
      toast({
        message: "Your admin request is on its way. Ambition looks good on you.",
        title: "Request sent",
        variant: "success",
      });
      router.refresh();
    });
  };

  const handleLogout = () => {
    startTransition(async () => {
      const supabase = createSupabaseBrowserClient();
      let signOutError: { message?: string } | null = null;

      if (supabase) {
        const { error } = await supabase.auth.signOut({ scope: "local" });
        signOutError = error;
      }

      if (signOutError) {
        toast({
          message: signOutError.message ?? "We couldn't sign you out right now. Mild chaos, deeply rude.",
          title: "Oh no",
          variant: "error",
        });
        return;
      }

      const response = await fetch("/api/demo-mode", {
        body: JSON.stringify({ mode: "user" }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      if (!response.ok) {
        toast({
          message: "We couldn't finish logging you out right now. The drama was unnecessary.",
          title: "Oh no",
          variant: "error",
        });
        return;
      }

      setMenuOpen(false);
      toast({
        message: "You have been signed out. The place feels a little emptier now.",
        title: "See you soon",
        variant: "success",
      });
      await pauseForToast();

      router.push("/");
      router.refresh();
    });
  };

  return (
    <>
      <div className="relative hidden md:block" ref={menuRef}>
        <button
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          type="button"
          className="flex min-w-[220px] shrink-0 items-center gap-2.5 rounded-full border border-border/70 bg-white/80 px-3 py-1 text-left outline-none hover:border-[#c9a27e]/55 hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-60"
          disabled={isPending}
          onClick={() => setMenuOpen((current) => !current)}
        >
          <Avatar className="size-9 text-xs" fallback={user.initials} />
          <div className="min-w-0 flex-1 text-left leading-[1.15]">
            <span className="text-[13px] font-semibold">{user.displayName}</span>
            <span className="block text-[11px] text-muted-foreground">{user.email}</span>
          </div>
        </button>

        {menuOpen ? (
          <div
            className="absolute right-0 top-full z-50 mt-2 w-64 rounded-[var(--radius-md)] border border-white/80 bg-[#fffaf4] p-1.5 text-sm text-muted-foreground shadow-[0_18px_50px_rgba(73,48,32,0.18)]"
            role="menu"
          >
            <div className="px-3 py-2 text-foreground">
              <p className="font-medium">{user.displayName}</p>
              <p className="text-xs font-normal text-muted-foreground">{user.email}</p>
            </div>

            <div className="px-3 pb-1.5 pt-1">
              <div className="relative inline-grid h-7 w-full grid-cols-2 items-center gap-1 rounded-lg border border-[#c9a27e]/45 bg-[linear-gradient(135deg,rgba(255,255,255,0.78)_0%,rgba(246,226,207,0.72)_100%)] p-0.5 shadow-[0_6px_16px_rgba(114,76,43,0.12)]">
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute bottom-0.5 top-0.5 w-[calc(50%-0.375rem)] rounded-md bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] shadow-[0_5px_14px_rgba(184,111,41,0.26)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    currentMode === "user" ? "translate-x-0.5" : "translate-x-[calc(100%+0.375rem)]"
                  }`}
                />
                {(["user", "admin"] as const).map((mode) => {
                  const isActive = currentMode === mode;

                  return (
                    <button
                      className={`relative z-10 h-6 rounded-md px-3 text-[11px] font-semibold leading-none transition-colors ${
                        isActive
                          ? "text-white"
                          : "text-[#5f3f2f] hover:bg-white/45 hover:text-[#8d542d]"
                      }`}
                      disabled={isPending || isSubmittingAdminDialog || (mode === "user" && isActive)}
                      key={mode}
                      onClick={() => {
                        if (mode === "admin") {
                          handleAdminToggle();
                        } else {
                          handleModeChange(mode);
                        }
                      }}
                      type="button"
                    >
                      {mode === "user" ? "User" : "Admin"}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="my-1.5 h-px bg-border/70" />

            <a
              className="block rounded-[var(--radius-sm)] px-3 py-1.5 transition-colors hover:bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] hover:!text-white"
              href="/my-bookings"
              role="menuitem"
            >
              My Booking
            </a>
            <button
              className="block w-full rounded-[var(--radius-sm)] px-3 py-1.5 text-left transition-colors hover:bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] hover:!text-white"
              disabled={isPending}
              onClick={() => {
                setAccountInfoOpen(true);
                setMenuOpen(false);
              }}
              role="menuitem"
              type="button"
            >
              Account Info
            </button>
            {currentMode === "admin" ? (
              <a
                className="block rounded-[var(--radius-sm)] px-3 py-1.5 transition-colors hover:bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] hover:!text-white"
                href="/admin"
                role="menuitem"
              >
                Admin Dashboard
              </a>
            ) : null}
            <button
              className="block w-full rounded-[var(--radius-sm)] px-3 py-1.5 text-left transition-colors hover:bg-[linear-gradient(135deg,#ff4b55_0%,#e00012_52%,#ff7a7f_100%)] hover:!text-white"
              disabled={isPending}
              onClick={handleLogout}
              role="menuitem"
              type="button"
            >
              Logout
            </button>
          </div>
        ) : null}
      </div>

      <Dialog
        open={adminDialogOpen}
        onOpenChange={(open) => {
          setAdminDialogOpen(open);
          if (!open) {
            setAdminPassword(ADMIN_ACCESS_PASSWORD_HINT);
            setRequestEmail(user.email);
            setShowAdminPassword(false);
          }
        }}
      >
        <DialogContent className="w-[min(92vw,28rem)] rounded-[var(--radius-sm)]">
          <DialogHeader className="pr-0 text-center">
            <DialogTitle>
              <span data-butterfly-anchor="admin-dialog-title">
              {adminDialogView === "login" ? "Admin Access" : "Request Admin Access"}
              </span>
            </DialogTitle>
            <DialogDescription className="text-center">
              {adminDialogView === "login"
                ? "Enter the admin access password to switch this signed-in account into admin mode."
                : "This account is not an admin yet. Confirm the email below and send a request for approval."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {adminDialogView === "login" ? (
              <div className="grid gap-1.5">
                <Label className="text-[13px]" htmlFor="admin-access-password">
                  Admin password
                </Label>
                <div className="relative">
                  <Input
                    className="h-10 rounded-lg border-[#e4d3c4] bg-[#fffdf9] px-3 pr-11 text-sm"
                    id="admin-access-password"
                    placeholder="Enter admin password"
                    type={showAdminPassword ? "text" : "password"}
                    value={adminPassword}
                    onChange={(event) => setAdminPassword(event.target.value)}
                  />
                  <button
                    aria-label={showAdminPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center justify-center text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={() => setShowAdminPassword((current) => !current)}
                    type="button"
                  >
                    {showAdminPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                <p className="text-xs leading-5 text-muted-foreground">
                  Hint: use <span className="font-semibold text-foreground">{ADMIN_ACCESS_PASSWORD_HINT}</span>
                </p>
              </div>
            ) : (
              <div className="grid gap-1.5">
                <Label className="text-[13px]" htmlFor="admin-request-email">
                  Email address
                </Label>
                <Input
                  className="h-10 rounded-lg border-[#e4d3c4] bg-[#fffdf9] px-3 text-sm"
                  id="admin-request-email"
                  placeholder="you@example.com"
                  type="email"
                  value={requestEmail}
                  onChange={(event) => setRequestEmail(event.target.value)}
                />
              </div>
            )}

            <Button
              className="booking-form-nav-primary !h-10 !w-full !rounded-lg !border !border-[#c8893e]/55 !bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] !px-3 !text-sm !font-semibold !leading-none !text-white shadow-[0_8px_20px_rgba(184,111,41,0.24)]"
              disabled={
                isPending ||
                isSubmittingAdminDialog ||
                (adminDialogView === "login" ? !adminPassword.trim() : !requestEmail.trim())
              }
              onClick={adminDialogView === "login" ? handleAdminAccessLogin : handleAdminRequest}
            >
              {isSubmittingAdminDialog
                ? "Working"
                : adminDialogView === "login"
                  ? "Enter admin mode"
                  : "Send admin request"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AccountInfoDialog open={accountInfoOpen} onOpenChange={setAccountInfoOpen} user={user} />
    </>
  );
}
