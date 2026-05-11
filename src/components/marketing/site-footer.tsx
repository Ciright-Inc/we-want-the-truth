import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { SiteLogo } from "@/components/marketing/site-logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/80 bg-neutral-50/95 py-12 text-sm text-muted-foreground dark:border-border dark:bg-neutral-950/90">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-2xl border border-border/70 bg-card/95 p-6 shadow-soft-sm ring-1 ring-black/[0.02] dark:bg-card/70 dark:ring-white/[0.04] sm:p-8">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:items-start lg:gap-12">
            <div className="space-y-5">
              <SiteLogo size="footer" />
              <p className="max-w-md leading-relaxed text-foreground/80">
                Software for public-interest transparency. Publish structured records responsibly with full control over your data and visibility.
              </p>
              <div className="inline-flex items-start gap-2 rounded-xl border border-brand/15 bg-brand-muted/45 px-3.5 py-2.5 text-xs leading-relaxed text-muted-foreground dark:border-brand/25 dark:bg-brand/10">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand dark:text-red-400" aria-hidden />
                <span>
                  Platform notice: We provide software infrastructure only, not legal advice.
                </span>
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:pt-1">
              <div className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Company</p>
                <div className="flex flex-col gap-2.5">
                  <Link href="/how-it-works" className="inline-flex items-center gap-1 text-foreground/85 transition-colors hover:text-brand dark:hover:text-red-400">
                    How It Works
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                  <Link href="/terms" className="inline-flex items-center gap-1 text-foreground/85 transition-colors hover:text-brand dark:hover:text-red-400">
                    Terms of Service
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                  <Link href="/privacy" className="inline-flex items-center gap-1 text-foreground/85 transition-colors hover:text-brand dark:hover:text-red-400">
                    Privacy Policy
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                  <Link href="/pricing" className="inline-flex items-center gap-1 text-foreground/85 transition-colors hover:text-brand dark:hover:text-red-400">
                    Pricing
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Quick actions</p>
                <div className="flex flex-col gap-2.5">
                  <Link href="/example-cases" className="inline-flex items-center gap-1 text-foreground/85 transition-colors hover:text-brand dark:hover:text-red-400">
                    View Demo Cases
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                  <Link href="/secure-domain" className="inline-flex items-center gap-1 text-foreground/85 transition-colors hover:text-brand dark:hover:text-red-400">
                    Start Your Case Setup
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-border/70 pt-4">
            <p className="text-xs tracking-wide text-muted-foreground">
              © {new Date().getFullYear()} We Want The Truth. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
