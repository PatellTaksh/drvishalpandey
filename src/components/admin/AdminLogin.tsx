import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { bootstrapAdmin, getBootstrapState } from "@/lib/admin-bootstrap.functions";
import { logAccountEvent } from "@/lib/activity";

export function AdminLogin({ onSignedIn }: { onSignedIn: () => void }) {
  const bootstrap = useServerFn(bootstrapAdmin);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const { data: state } = useQuery({
    queryKey: ["admin-bootstrap-state"],
    queryFn: () => getBootstrapState(),
  });

  const setupMode = state?.needsBootstrap === true;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      if (setupMode) {
        await bootstrap({ data: { email, password } });
      }
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      await logAccountEvent("sign_in");
      onSignedIn();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sign in failed.");
    } finally {
      setBusy(false);
    }
  }

  async function resetPassword() {
    if (!email) {
      toast.error("Enter your email address first.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error(error.message);
    else toast.success("Password reset email sent.");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-5">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-card">
        <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <ShieldCheck className="size-5" aria-hidden />
        </span>
        <h1 className="mt-5 text-2xl">{setupMode ? "Create your admin account" : "Admin sign in"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {setupMode
            ? "First-time setup. Use your own email address and choose a strong password."
            : "This area is private. Sign in to manage your portfolio content."}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email</Label>
            <Input
              id="admin-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              autoComplete={setupMode ? "new-password" : "current-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : null}
            {setupMode ? "Create account and sign in" : "Sign in"}
          </Button>
        </form>

        {!setupMode ? (
          <button
            type="button"
            onClick={resetPassword}
            className="mt-4 text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            Forgot your password?
          </button>
        ) : null}
      </div>
    </div>
  );
}
