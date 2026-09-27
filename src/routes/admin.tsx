import { createFileRoute, Link, Outlet, useRouter } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  ExternalLink,
  FileText,
  Inbox,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Settings,
  User,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { COLLECTIONS } from "@/lib/admin-collections";
import { getAdminSession } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin · Portfolio" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Private content management area." },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [sessionChecked, setSessionChecked] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setHasSession(Boolean(data.session));
      setSessionChecked(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setHasSession(Boolean(session));
      setSessionChecked(true);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const { data: session, isLoading: checkingAdmin } = useQuery({
    queryKey: ["admin-session"],
    queryFn: () => getAdminSession(),
    enabled: hasSession,
    retry: false,
  });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    await router.navigate({ to: "/admin", replace: true });
  }

  if (!sessionChecked || (hasSession && checkingAdmin)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!hasSession) {
    return (
      <AdminLogin
        onSignedIn={() => {
          setHasSession(true);
          void queryClient.invalidateQueries();
        }}
      />
    );
  }

  if (session && !session.isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-5">
        <div className="max-w-sm rounded-2xl border border-border bg-card p-8 text-center">
          <h1 className="text-xl">No access</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This account is not allowed to manage the site.
          </p>
          <Button className="mt-5" variant="outline" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  const links = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/messages", label: "Messages", icon: Inbox },
  ] as const;

  const tail = [
    { to: "/admin/profile", label: "Profile & hero", icon: User },
    { to: "/admin/contact", label: "Contact details", icon: FileText },
    { to: "/admin/settings", label: "Site & SEO", icon: Settings },
    { to: "/admin/account", label: "Account", icon: User },
  ] as const;

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur lg:px-8">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Toggle menu"
          onClick={() => setNavOpen((open) => !open)}
        >
          <Menu className="size-5" />
        </Button>
        <span className="font-display text-lg">Portfolio admin</span>
        <div className="ml-auto flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1 text-xs text-muted-foreground hover:text-foreground sm:flex"
          >
            View site <ExternalLink className="size-3" />
          </a>
          <ThemeToggle />
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="size-4" /> Sign out
          </Button>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 lg:px-8">
        <nav
          className={`${navOpen ? "block" : "hidden"} w-full shrink-0 lg:block lg:w-56`}
          aria-label="Admin sections"
        >
          <ul className="space-y-1" onClick={() => setNavOpen(false)}>
            {links.map((link) => (
              <NavRow key={link.to} {...link} />
            ))}
            <li className="px-3 pt-4 pb-1 text-[0.7rem] uppercase tracking-widest text-muted-foreground">
              Content
            </li>
            {COLLECTIONS.map((collection) => (
              <NavRow
                key={collection.slug}
                to="/admin/c/$slug"
                params={{ slug: collection.slug }}
                label={collection.title}
              />
            ))}
            <li className="px-3 pt-4 pb-1 text-[0.7rem] uppercase tracking-widest text-muted-foreground">
              Settings
            </li>
            {tail.map((link) => (
              <NavRow key={link.to} {...link} />
            ))}
          </ul>
        </nav>

        <main className={`${navOpen ? "hidden lg:block" : "block"} min-w-0 flex-1`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function NavRow({
  to,
  label,
  params,
  exact,
}: {
  to: string;
  label: string;
  params?: Record<string, string>;
  exact?: boolean;
}) {
  return (
    <li>
      <Link
        to={to}
        params={params as never}
        activeOptions={{ exact: Boolean(exact) }}
        activeProps={{ className: "bg-accent text-accent-foreground font-medium" }}
        className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        {label}
      </Link>
    </li>
  );
}
