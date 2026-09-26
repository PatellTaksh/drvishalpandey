import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";
import type { NavItem, Profile, SiteSettings } from "@/lib/portfolio.functions";

function hrefFor(href: string) {
  if (href.startsWith("#")) return `/${href}`;
  return href;
}

export function SiteHeader({
  nav,
  profile,
  settings,
}: {
  nav: NavItem[];
  profile: Profile | null;
  settings: SiteSettings | null;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const brand = settings?.site_name || profile?.full_name || "Portfolio";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "border-b border-border bg-background/85 backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="/" className="flex items-center gap-2.5">
          {settings?.logo_url ? (
            <img src={settings.logo_url} alt="" className="h-8 w-8 rounded-full object-cover" />
          ) : null}
          <span className="font-display text-xl tracking-tight">{brand}</span>
        </a>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <a
              key={item.id}
              href={hrefFor(item.href)}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="font-display text-lg">{brand}</SheetTitle>
              <nav aria-label="Mobile" className="mt-6 flex flex-col gap-1">
                {nav.map((item) => (
                  <a
                    key={item.id}
                    href={hrefFor(item.href)}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2.5 text-base text-foreground transition-colors hover:bg-accent"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
