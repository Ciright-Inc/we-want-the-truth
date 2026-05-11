import Link from "next/link";
import { SiteLogo } from "@/components/marketing/site-logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/80 bg-neutral-50/95 py-12 text-sm text-muted-foreground dark:border-border dark:bg-neutral-950/90">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 border border-border/70 bg-card/75 p-6 shadow-soft-sm ring-1 ring-black/[0.02] dark:bg-card/50 dark:ring-white/[0.04] sm:rounded-2xl sm:p-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-12">
          <div className="max-w-md space-y-4">
            <SiteLogo size="footer" />
            <p className="leading-relaxed text-foreground/80">
              Software for public-interest transparency. Not a law firm. Not legal advice.
            </p>
          </div>
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground md:text-right">Company</p>
            <div className="flex flex-col gap-2.5 md:text-right">
              <Link href="/terms" className="text-foreground/85 transition-colors hover:text-brand dark:hover:text-red-400">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-foreground/85 transition-colors hover:text-brand dark:hover:text-red-400">
                Privacy Policy
              </Link>
              <Link href="/pricing" className="text-foreground/85 transition-colors hover:text-brand dark:hover:text-red-400">
                Pricing
              </Link>
            </div>
          </div>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} We Want The Truth. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
