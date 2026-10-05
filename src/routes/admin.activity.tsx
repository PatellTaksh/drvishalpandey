import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { listActivity } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/activity")({ component: Activity });

const ACTION_LABEL: Record<string, string> = {
  sign_in: "Signed in",
  sign_out: "Signed out",
  password_change: "Changed password",
  insert: "Added",
  update: "Edited",
  delete: "Deleted",
};

function Activity() {
  const list = useServerFn(listActivity);
  const [q, setQ] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "activity"],
    queryFn: () => list({ data: {} }),
  });
  const rows = (data ?? []).filter((r) =>
    `${r.action} ${r.entity ?? ""} ${r.summary ?? ""}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl">Activity log</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Sign-ins, password changes and every content change, newest first.
      </p>
      <Input className="mt-6 max-w-xs" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
      {isLoading ? (
        <p className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading…
        </p>
      ) : rows.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">No activity yet.</p>
      ) : (
        <ul className="mt-6 divide-y divide-border rounded-xl border border-border bg-card">
          {rows.map((r) => (
            <li key={r.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-4 py-3 text-sm">
              <span className="font-medium">{ACTION_LABEL[r.action] ?? r.action}</span>
              {r.entity ? <span className="text-muted-foreground">{r.entity.replace(/_/g, " ")}</span> : null}
              {r.summary ? <span className="truncate">“{r.summary}”</span> : null}
              <span className="ml-auto text-xs text-muted-foreground">
                {new Date(r.created_at).toLocaleString()} · {r.actor_email ?? "unknown"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
