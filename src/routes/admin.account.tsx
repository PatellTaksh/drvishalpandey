import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { getAdminSession } from "@/lib/admin.functions";
import { logAccountEvent } from "@/lib/activity";

export const Route = createFileRoute("/admin/account")({
  component: Account,
});

function Account() {
  const session = useServerFn(getAdminSession);
  const { data } = useQuery({ queryKey: ["admin-session"], queryFn: () => session() });
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  async function changePassword(event: React.FormEvent) {
    event.preventDefault();
    if (next.length < 8) {
      toast.error("Use at least 8 characters.");
      return;
    }
    if (next !== confirm) {
      toast.error("The new passwords do not match.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({
      password: next,
      current_password: current,
    } as Parameters<typeof supabase.auth.updateUser>[0]);
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    void logAccountEvent("password_change");
    setCurrent("");
    setNext("");
    setConfirm("");
    toast.success("Password updated.");
  }

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl">Account</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Signed in as {data?.email ?? "…"}.
      </p>

      <form onSubmit={changePassword} className="mt-6 space-y-4 rounded-xl border border-border bg-card p-6">
        <h3 className="text-lg">Change password</h3>
        <div className="space-y-2">
          <Label htmlFor="current">Current password</Label>
          <Input
            id="current"
            type="password"
            autoComplete="current-password"
            value={current}
            onChange={(event) => setCurrent(event.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="next">New password</Label>
          <Input
            id="next"
            type="password"
            autoComplete="new-password"
            value={next}
            onChange={(event) => setNext(event.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Repeat new password</Label>
          <Input
            id="confirm"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={busy}>
          {busy ? <Loader2 className="size-4 animate-spin" /> : null}
          Update password
        </Button>
      </form>
    </div>
  );
}
