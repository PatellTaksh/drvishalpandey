import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Mail } from "lucide-react";
import { getDashboardStats } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

const LABELS: Record<string, string> = {
  projects: "Projects",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  certifications: "Certifications",
  achievements: "Achievements",
  services: "Services",
  contact_messages: "Messages",
};

function Dashboard() {
  const stats = useServerFn(getDashboardStats);
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => stats(),
  });

  if (isLoading || !data) {
    return (
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> Loading…
      </p>
    );
  }

  return (
    <div>
      <h2 className="text-2xl">Dashboard</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        A quick look at what is on your site right now.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(data.counts).map(([table, count]) => (
          <div key={table} className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              {LABELS[table] ?? table}
            </p>
            <p className="mt-2 font-display text-3xl">{count}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg">Latest messages</h3>
          <Link to="/admin/messages" className="text-sm text-primary underline-offset-4 hover:underline">
            Open inbox{data.unreadMessages > 0 ? ` (${data.unreadMessages} unread)` : ""}
          </Link>
        </div>

        {data.recentMessages.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No messages yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {data.recentMessages.map((message) => (
              <li key={message.id} className="flex gap-3 border-t border-border pt-3 first:border-0 first:pt-0">
                <Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    {message.name}
                    {!message.is_read ? (
                      <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-[0.65rem] uppercase tracking-wide text-accent-foreground">
                        New
                      </span>
                    ) : null}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {message.subject ? `${message.subject} — ` : ""}
                    {message.message}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
