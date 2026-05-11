"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Globe, Info, ShieldCheck } from "lucide-react";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SecureDomainPage() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<{ available?: boolean; priceCents?: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validateDomain(input: string): string | null {
    const normalized = input.trim().toLowerCase();
    if (!normalized) return "Domain is required.";
    if (normalized.length < 3) return "Domain must be at least 3 characters.";
    if (!/^(?=.{3,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/.test(normalized)) {
      return "Enter a valid domain like example.com.";
    }
    return null;
  }

  async function check() {
    const validationError = validateDomain(domain);
    if (validationError) {
      setError(validationError);
      setResult(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/domain/search?domain=${encodeURIComponent(domain)}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not check domain right now.");
      }
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : "Could not check domain.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="hero-surface flex-1 border-b border-border/60">
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-16">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <div className="rounded-2xl border border-border/70 bg-card/95 p-6 shadow-soft-sm ring-1 ring-black/[0.02] dark:ring-white/[0.04] sm:p-8">
              <div className="max-w-3xl space-y-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand dark:text-red-400">Domain onboarding</p>
                <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">Secure your case domain</h1>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Search domain availability, then proceed to checkout, provisioning, and DNS setup through the platform flow.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <div>
                  <Label htmlFor="domain" className="text-sm font-medium text-foreground">
                    Desired domain
                  </Label>
                  <Input
                    id="domain"
                    placeholder="example-case.com"
                    value={domain}
                    onChange={(e) => {
                      setDomain(e.target.value);
                      if (error) setError(null);
                    }}
                    className="mt-1.5 h-11 border-border/80 bg-background"
                  />
                </div>
                {error ? <p className="text-xs font-medium text-red-600 dark:text-red-400">{error}</p> : null}
                <Button type="button" size="lg" variant="destructive" onClick={check} disabled={loading || domain.length < 3}>
                  {loading ? "Checking availability..." : "Check Domain Availability"}
                  {!loading ? <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden /> : null}
                </Button>

                {result && (
                  <div className="rounded-xl border border-border/70 bg-neutral-50/90 p-4 text-sm dark:bg-neutral-950/40">
                    <p className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                      <BadgeCheck className="h-4 w-4 text-brand dark:text-red-400" aria-hidden />
                      {result.available ? "Potentially available (stub check)" : "Unavailable (reserved stub)"}
                    </p>
                    {result.priceCents != null ? (
                      <p className="mt-2 text-muted-foreground">Illustrative registrar price: ${(result.priceCents / 100).toFixed(2)}</p>
                    ) : null}
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      Add AWS/hosting pass-through + $49.99 setup at Stripe checkout when production keys are configured.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-border/70 bg-card/95 p-5 shadow-soft-sm ring-1 ring-black/[0.02] dark:ring-white/[0.04] sm:p-6">
                <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand dark:text-red-400">
                  <Globe className="h-3.5 w-3.5" aria-hidden />
                  What happens next
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                  <li>1) Domain availability screening</li>
                  <li>2) Checkout and payment verification</li>
                  <li>3) DNS provisioning instructions</li>
                  <li>4) Tenant domain activation</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-border/70 bg-card/95 p-5 shadow-soft-sm ring-1 ring-black/[0.02] dark:ring-white/[0.04] sm:p-6">
                <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <ShieldCheck className="h-4 w-4 text-brand dark:text-red-400" aria-hidden />
                  Pricing note
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Domain registration and infrastructure are pass-through costs, plus a one-time onboarding service fee.
                </p>
                <Button asChild variant="outline" className="mt-4 w-full border-border/90 bg-card">
                  <Link href="/pricing">
                    View Full Pricing
                    <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
                  </Link>
                </Button>
              </div>

              <div className="rounded-xl border border-brand/15 bg-brand-muted/35 px-4 py-3 text-xs leading-relaxed text-muted-foreground dark:border-brand/25 dark:bg-brand/10">
                <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                  <Info className="h-3.5 w-3.5 text-brand dark:text-red-400" aria-hidden />
                  Transparency:
                </span>{" "}
                Availability and price shown here are preliminary checks before final registrar confirmation.
              </div>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
