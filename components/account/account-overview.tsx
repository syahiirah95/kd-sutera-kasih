import { ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { ContextHelp } from "@/components/help/context-help";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AuthUser } from "@/lib/types/auth";

type AccountOverviewProps = {
  user: AuthUser;
};

export function AccountOverview({ user }: AccountOverviewProps) {
  const isGoogleOnly =
    user.providers.includes("google") && !user.providers.includes("password");

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="grid gap-6">
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/12 text-primary">
                <UserRound className="size-5" />
              </div>
              <div>
                <CardTitle>{user.displayName}</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="flex flex-wrap gap-2">
              {user.providers.map((provider) => (
                <StatusBadge key={provider} status="approved">
                  {provider === "google" ? "Google Auth" : "Email / Password"}
                </StatusBadge>
              ))}
            </div>
            <p>
              Keep your sign-in details clear and use the account area to manage the information connected to your booking journey.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>What this screen should communicate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p>Clear identity details and current auth method.</p>
            <p>Password management only when the account supports it.</p>
            <p>Helpful guidance with hover tooltip and click modal for anything confusing.</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6">
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/12 text-primary">
                <ShieldCheck className="size-5" />
              </div>
              <div className="flex items-center gap-3">
                <CardTitle>Password and account security</CardTitle>
                <ContextHelp
                  label="Password rules help"
                  tooltip="Password change only appears for email/password accounts."
                  title="Password management rules"
                  description="Email/password accounts should be able to update their password here. Google-auth accounts should instead see a concise note that credentials are managed by Google."
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isGoogleOnly ? (
              <div className="rounded-[var(--radius-md)] border border-border/70 bg-white/60 px-4 py-4 text-sm leading-7 text-muted-foreground">
                This account is connected through Google. Password changes for this sign-in method should be managed directly through your Google account.
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="current-password">Current password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-password">New password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button>Update password</Button>
                  <Button variant="secondary">Cancel changes</Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Sparkles className="size-5 text-primary" />
              Account support note
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-7 text-muted-foreground">
            Your account area should always make it easy to understand how you signed in, where to update your password, and what to expect if your credentials are managed by Google.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
