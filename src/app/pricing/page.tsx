import Link from "next/link";
import { ArrowRight, BadgeDollarSign, CheckCircle2, CircleDollarSign, ShieldCheck } from "lucide-react";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const addOns = [
  { name: "Super Admin / Advanced Controls", price: "$9.99/mo" },
  { name: "Video Management", price: "$9.99/mo" },
  { name: "Comment Management", price: "$9.99/mo" },
];

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="hero-surface flex-1 border-b border-border/60">
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-16">
          <div className="max-w-3xl space-y-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand dark:text-red-400">Commercial model</p>
            <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.65rem]">Pricing</h1>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-[1.05rem]">
              Transparent economics. Core tools for managing your case record are free; infrastructure, advanced controls,
              and operational onboarding are billed fairly.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Card className="h-full border-border/70 bg-card/95 shadow-soft-sm ring-1 ring-black/[0.02] dark:ring-white/[0.04]">
              <CardHeader className="space-y-4">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-muted text-brand dark:bg-brand/15 dark:text-red-400">
                  <ShieldCheck className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <CardTitle className="text-xl">Base platform</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">Core publishing and record-management workflow.</p>
                </div>
                <Badge variant="success" className="w-fit">
                  Free to manage content
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>Organize matter data, publish public pages, and retain ownership of your case materials.</p>
                <div className="rounded-lg border border-border/70 bg-neutral-50/85 px-3.5 py-3 text-foreground dark:bg-neutral-900/50">
                  <p className="font-medium">You own and control all data. We provide the software infrastructure only.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="h-full border-border/70 bg-card/95 shadow-soft-sm ring-1 ring-black/[0.02] dark:ring-white/[0.04]">
              <CardHeader className="space-y-4">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-muted text-brand dark:bg-brand/15 dark:text-red-400">
                  <BadgeDollarSign className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <CardTitle className="text-xl">Paid add-ons</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">Activate only the modules you need.</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                {addOns.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between gap-3 border-b border-border/70 py-3.5 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand dark:text-red-400" aria-hidden />
                      <span className="text-foreground/95">{item.name}</span>
                    </div>
                    <span className="shrink-0 font-semibold text-foreground">{item.price}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6 border-border/70 bg-card/95 shadow-soft-sm ring-1 ring-black/[0.02] dark:ring-white/[0.04]">
            <CardHeader className="space-y-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-muted text-brand dark:bg-brand/15 dark:text-red-400">
                <CircleDollarSign className="h-5 w-5" aria-hidden />
              </div>
              <CardTitle className="text-xl">Domain and deployment</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm leading-relaxed text-muted-foreground sm:grid-cols-2">
              <p>Domain registration is charged at pass-through registrar cost.</p>
              <p>AWS / hosting deployment infrastructure is billed at pass-through cost.</p>
              <p className="font-semibold text-foreground">$49.99 platform setup and service fee per onboarding.</p>
              <p>All card charges are processed securely through Stripe.</p>
            </CardContent>
          </Card>

          <div className="mt-10 rounded-2xl border border-border/70 bg-card/95 p-6 shadow-soft-sm ring-1 ring-black/[0.02] dark:ring-white/[0.04] sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-2xl space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand dark:text-red-400">Get started</p>
                <p className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-[1.7rem]">
                  Start your case domain and launch with confidence.
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Begin onboarding, then enable add-ons as your case operations grow.
                </p>
              </div>
              <Button asChild size="lg" variant="destructive">
                <Link href="/secure-domain">
                  Start Domain Checkout
                  <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
