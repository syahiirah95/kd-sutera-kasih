"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ContextHelp } from "@/components/help/context-help";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type DemoMode } from "@/lib/constants/demo-mode";
import type { AuthUser } from "@/lib/types/auth";

type ProfileMenuProps = {
  currentMode: DemoMode;
  user: AuthUser;
};

export function ProfileMenu({ currentMode, user }: ProfileMenuProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleModeChange = (mode: DemoMode) => {
    startTransition(async () => {
      await fetch("/api/demo-mode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      });

      router.refresh();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="hidden min-w-[220px] shrink-0 items-center gap-2.5 rounded-full border border-border/70 bg-white/70 px-3 py-1 text-left transition hover:bg-white/85 disabled:pointer-events-none disabled:opacity-60 md:flex"
          disabled={isPending}
        >
          <Avatar className="size-9 text-xs" fallback={user.initials} />
          <div className="min-w-0 flex-1 text-left leading-[1.15]">
            <span className="text-[13px] font-semibold">{user.displayName}</span>
            <span className="block text-[11px] text-muted-foreground">{user.email}</span>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-1.5">
        <DropdownMenuLabel className="px-3 py-2">
          <div>
            <p className="font-medium">{user.displayName}</p>
            <p className="text-xs font-normal text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <div className="flex items-center gap-2 px-3 pb-1.5 pt-1">
          <div className="booking-planner-mode-toggle relative inline-grid h-7 w-full grid-cols-2 items-center gap-1 rounded-lg border border-[#c9a27e]/45 bg-[linear-gradient(135deg,rgba(255,255,255,0.78)_0%,rgba(246,226,207,0.72)_100%)] p-0.5 shadow-[0_6px_16px_rgba(114,76,43,0.12)]">
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
                  className={`booking-planner-control relative z-10 h-6 rounded-md px-3 !text-[11px] font-semibold !leading-none transition ${
                    isActive
                      ? "text-white"
                      : "text-[#5f3f2f] hover:text-[#8d542d]"
                  }`}
                  disabled={isPending || isActive}
                  key={mode}
                  onClick={() => handleModeChange(mode)}
                  type="button"
                >
                  {mode === "user" ? "User" : "Admin"}
                </button>
              );
            })}
          </div>
          <ContextHelp
            label="Role switch help"
            tooltip="Switch between account view and admin review view after signing in."
            title="View options"
            description="Use this toggle to move between your booking account experience and the admin review dashboard."
            contentClassName="w-[min(92vw,28rem)]"
            triggerClassName="!size-7 shrink-0"
          />
        </div>
        <DropdownMenuSeparator className="my-1.5" />
        <DropdownMenuItem asChild className="py-1.5 hover:!bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] hover:!text-white hover:!shadow-[0_6px_16px_rgba(184,111,41,0.22)] focus:!bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] focus:!text-white focus:!shadow-[0_6px_16px_rgba(184,111,41,0.22)]">
          <a href="/account">Account settings</a>
        </DropdownMenuItem>
        {currentMode === "admin" ? (
          <DropdownMenuItem asChild className="py-1.5 hover:!bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] hover:!text-white hover:!shadow-[0_6px_16px_rgba(184,111,41,0.22)] focus:!bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] focus:!text-white focus:!shadow-[0_6px_16px_rgba(184,111,41,0.22)]">
            <a href="/admin">Admin Dashboard</a>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem asChild className="py-1.5 hover:!bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] hover:!text-white hover:!shadow-[0_6px_16px_rgba(184,111,41,0.22)] focus:!bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] focus:!text-white focus:!shadow-[0_6px_16px_rgba(184,111,41,0.22)]">
          <a href="/booking">My Booking</a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="py-1.5 hover:!bg-[linear-gradient(135deg,#ff4b55_0%,#e00012_52%,#ff7a7f_100%)] hover:!text-white hover:!shadow-[0_0_16px_rgba(255,31,45,0.38),0_6px_16px_rgba(224,0,18,0.28)] focus:!bg-[linear-gradient(135deg,#ff4b55_0%,#e00012_52%,#ff7a7f_100%)] focus:!text-white focus:!shadow-[0_0_16px_rgba(255,31,45,0.38),0_6px_16px_rgba(224,0,18,0.28)]">
          <a href="/login">Logout</a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
