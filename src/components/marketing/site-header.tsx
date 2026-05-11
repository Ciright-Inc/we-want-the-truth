"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
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
  const [open, setOpen] = useState(false);

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
            <Link href="/example-cases">View Demo Cases</Link>
          </Button>
          <Button asChild size="sm" variant="destructive" className="hidden sm:inline-flex">
            <Link href="/secure-domain">Start Your Case Setup</Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 w-9 shrink-0 border-border/90 px-0 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
          </Button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-border/70 px-4 pb-4 pt-3 md:hidden">
          <nav className="grid gap-1 text-sm font-medium">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-neutral-100 hover:text-foreground dark:hover:bg-neutral-900"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 grid gap-2 sm:hidden">
            <Button asChild variant="outline" size="sm" className="border-border/90 shadow-none">
              <Link href="/example-cases" onClick={() => setOpen(false)}>
                View Demo Cases
              </Link>
            </Button>
            <Button asChild size="sm" variant="destructive">
              <Link href="/secure-domain" onClick={() => setOpen(false)}>
                Start Your Case Setup
              </Link>
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
