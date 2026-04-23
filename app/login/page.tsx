import { ContextHelp } from "@/components/help/context-help";
import { PageShell } from "@/components/shared/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <PageShell className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-16">
      <Card className="w-full max-w-xl">
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <CardTitle className="font-display text-4xl font-semibold">
              Sign in to continue
            </CardTitle>
            <ContextHelp
              label="Sign-in help"
              tooltip="Users can log in with email/password or Google."
              title="Authentication methods"
              description="This project uses Supabase Auth with email/password and Google sign-in. Magic link is intentionally excluded."
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" placeholder="judge@example.com" type="email" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" placeholder="Enter your password" type="password" />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button size="lg">Sign in with email</Button>
            <Button size="lg" variant="secondary">
              Continue with Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
