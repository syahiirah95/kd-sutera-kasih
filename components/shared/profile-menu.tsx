"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ContextHelp } from "@/components/help/context-help";
import { StatusBadge } from "@/components/shared/status-badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type DemoMode, DEMO_MODE_LABELS } from "@/lib/constants/demo-mode";
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
        <Button
          size="lg"
          variant="secondary"
          className="gap-3 px-3"
          disabled={isPending}
        >
          <Avatar fallback={user.initials} />
          <span className="hidden text-left md:block">
            <span className="block text-sm font-semibold">{user.displayName}</span>
            <span className="block text-xs text-muted-foreground">{user.email}</span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-medium">{user.displayName}</p>
              <p className="text-xs font-normal text-muted-foreground">{user.email}</p>
            </div>
            <ContextHelp
              label="Role switch help"
              tooltip="Switch between account view and admin review view after signing in."
              title="View options"
              description="Use this menu to move between your booking account experience and the admin review dashboard."
            />
          </div>
          <StatusBadge status={currentMode === "admin" ? "approved" : "pending"}>
            {DEMO_MODE_LABELS[currentMode]}
          </StatusBadge>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => handleModeChange("user")}>
          View as User
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleModeChange("admin")}>
          View as Admin
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/account">Account settings</a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={currentMode === "admin" ? "/admin" : "/"}>Go to current view</a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/login">Logout</a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
