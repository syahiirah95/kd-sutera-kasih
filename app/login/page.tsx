import { LockKeyhole, Sparkles, WandSparkles } from "lucide-react";
import { ContextHelp } from "@/components/help/context-help";
import { PageShell } from "@/components/shared/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <PageShell className="flex min-h-[calc(100vh-8rem)] items-center py-16">
      <div className="grid w-full gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="overflow-hidden border-white/70 bg-gradient-to-br from-white/90 via-[#fff8f0] to-[#fdebd9]">
          <CardContent className="space-y-8 p-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Secure Access
              </p>
              <h1 className="font-display text-5xl font-semibold leading-tight md:text-6xl">
                Sign in to manage your booking and account details.
              </h1>
              <p className="max-w-xl text-base leading-8 text-muted-foreground">
                Access your account to view booking details, manage your information, and continue your Dewan Sutera Kasih journey with ease.
              </p>
            </div>
            <div className="grid gap-4">
              {[
                {
                  icon: LockKeyhole,
                  text: "Choose the sign-in method that suits you best: email and password or Google.",
                },
                {
                  icon: Sparkles,
                  text: "Enjoy a smoother booking journey with clear account access and practical guidance.",
                },
                {
                  icon: WandSparkles,
                  text: "Manage your profile and booking information in one place after sign-in.",
                },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-start gap-3 rounded-[var(--radius-md)] border border-white/70 bg-white/60 px-4 py-4 text-sm leading-7 text-muted-foreground"
                >
                  <item.icon className="mt-1 size-4 shrink-0 text-primary" />
                  {item.text}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <CardTitle className="font-display text-4xl font-semibold">
                Sign in to continue
              </CardTitle>
              <ContextHelp
                label="Sign-in help"
                tooltip="Users can log in with email/password or Google."
                title="Authentication methods"
                description="Sign in using your email and password or continue with Google to access your booking account."
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" placeholder="you@example.com" type="email" />
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
      </div>
    </PageShell>
  );
}
