import Link from "next/link";
import { SiteLogo } from "@/components/marketing/site-logo";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/example-cases", label: "Example Cases" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 shadow-soft-sm backdrop-blur-md dark:bg-background/85">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <SiteLogo />
        <nav className="hidden flex-wrap items-center gap-1 text-sm font-medium md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-neutral-100 hover:text-foreground dark:hover:bg-neutral-900 dark:hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex border-border/90 shadow-none">
            <Link href="/example-cases">See Example Case</Link>
          </Button>
          <Button asChild size="sm" variant="destructive">
            <Link href="/secure-domain">Secure Your Case Domain</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
