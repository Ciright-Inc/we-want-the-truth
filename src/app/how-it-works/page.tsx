import Link from "next/link";
import { ArrowRight, FileCheck2, Files, Globe, LayoutList, MessageSquareText, SearchCheck, ShieldCheck, Settings2 } from "lucide-react";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const steps = [
  {
    title: "Search and secure your case domain",
    description: "Reserve the right domain identity for your matter and establish a trusted public entry point.",
    icon: SearchCheck,
  },
  {
    title: "Create your case profile",
    description: "Set case summary, category, parties, and publication preferences in a structured format.",
    icon: FileCheck2,
  },
  {
    title: "Upload filings, evidence, media, and records",
    description: "Collect documents, exhibits, videos, audio, and supporting records with clear organization.",
    icon: Files,
  },
  {
    title: "Build a dated factual timeline",
    description: "Lay out events chronologically so readers can follow facts without confusion.",
    icon: LayoutList,
  },
  {
    title: "Publish your public case page",
    description: "Go live with a clean, verifiable case narrative that stays aligned to your source materials.",
    icon: Globe,
  },
  {
    title: "Invite public review, comments, and votes",
    description: "Enable transparent participation while retaining moderation controls.",
    icon: MessageSquareText,
  },
  {
    title: "Manage everything from your admin panel",
    description: "Control content, updates, and visibility from a single operational dashboard.",
    icon: Settings2,
  },
];

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="hero-surface flex-1 border-b border-border/60">
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-16">
          <div className="max-w-3xl space-y-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand dark:text-red-400">Operating model</p>
            <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.65rem]">How It Works</h1>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-[1.05rem]">
              A disciplined workflow from domain to publication. You control your facts, your visibility, and your process;
              the platform remains software infrastructure, not legal advice.
            </p>
          </div>

          <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:gap-5">
            {steps.map((step, i) => (
              <li key={step.title}>
                <Card className="h-full border-border/70 bg-card/95 shadow-soft-sm ring-1 ring-black/[0.02] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft dark:ring-white/[0.04]">
                  <CardHeader className="space-y-4 pb-3">
                    <div className="flex items-center justify-between gap-4">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-muted text-brand dark:bg-brand/15 dark:text-red-400">
                        <step.icon className="h-5 w-5" strokeWidth={1.85} aria-hidden />
                      </div>
                      <span className="text-xs font-semibold tracking-[0.16em] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <CardTitle className="text-[1.05rem] font-semibold leading-snug tracking-tight text-foreground">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 text-sm leading-relaxed text-muted-foreground">{step.description}</CardContent>
                </Card>
              </li>
            ))}
          </ol>

          <div className="mt-10 rounded-2xl border border-border/70 bg-card/95 p-6 shadow-soft-sm ring-1 ring-black/[0.02] dark:ring-white/[0.04] sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-2xl space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand dark:text-red-400">Launch</p>
                <p className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-[1.7rem]">Ready to publish your case professionally?</p>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Start with a secure domain, then build and publish with full administrative control.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" variant="destructive">
                  <Link href="/secure-domain">
                    Secure Your Case Domain
                    <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-border/90 bg-card">
                  <Link href="/example-cases">See Example Case</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-brand/15 bg-brand-muted/40 px-4 py-3 text-xs leading-relaxed text-muted-foreground dark:border-brand/25 dark:bg-brand/10">
            <span className="inline-flex items-center gap-1.5 font-medium text-foreground/90">
              <ShieldCheck className="h-3.5 w-3.5 text-brand dark:text-red-400" aria-hidden />
              Compliance note:
            </span>{" "}
            The platform provides software tooling for structured publication and public transparency; it does not provide legal advice.
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
