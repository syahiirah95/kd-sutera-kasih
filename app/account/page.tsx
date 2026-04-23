import { ContextHelp } from "@/components/help/context-help";
import { PageShell } from "@/components/shared/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AccountPage() {
  return (
    <PageShell className="space-y-8 pb-16 pt-8 md:pt-12">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-4xl font-semibold md:text-5xl">
          Account settings scaffold
        </h1>
        <ContextHelp
          label="Account help"
          tooltip="Password updates only apply to email/password accounts."
          title="Account settings"
          description="Email/password users should be able to change their password here. Google-auth users should instead see a clear note that their credentials are managed by Google."
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Password update for email/password users</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="current-password">Current password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-password">New password</Label>
              <Input id="new-password" type="password" />
            </div>
            <Button>Update password</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Google-auth behavior</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-7 text-muted-foreground">
            If the authenticated account was created through Google, this page should hide the password form and show a concise note explaining that password management is handled through Google instead.
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
