import Link from "next/link";
import { FileText, LayoutList, Shield } from "lucide-react";
import { JusticeScaleHero } from "@/components/justice-scale-hero";
import { PlatformDisclaimer } from "@/components/legal-disclaimer";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteLogoMark } from "@/components/marketing/site-logo";
import { Button } from "@/components/ui/button";

const pillars = [
  {
    title: "Organized record",
    body: "Documents, exhibits, and filings in one structured place.",
    icon: FileText,
  },
  {
    title: "Clear timeline",
    body: "Chronology and evidence mapped for readability.",
    icon: LayoutList,
  },
  {
    title: "You stay in control",
    body: "Your data, your publication choices, your responsibility.",
    icon: Shield,
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">
        <section className="hero-surface border-b border-border/60 px-4 pb-20 pt-12 sm:px-6 sm:pb-24 sm:pt-16 lg:pb-28">
          <div className="mx-auto max-w-6xl space-y-14 lg:space-y-16">
            <JusticeScaleHero />

            <div className="border-t border-border/60 pt-14 lg:pt-16">
              <div className="mb-8 max-w-2xl lg:mb-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand dark:text-red-400">
                  What you get
                </p>
                <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-[1.65rem]">
                  Everything in one structured case page
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Document the record, show the timeline, and invite transparent review — without losing control of your
                  narrative.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                {pillars.map(({ title, body, icon: Icon }) => (
                  <div
                    key={title}
                    className="group flex h-full flex-col rounded-2xl border border-border/70 bg-card p-6 shadow-soft-sm ring-1 ring-black/[0.02] transition-shadow duration-200 hover:border-border hover:shadow-soft dark:bg-card dark:ring-white/[0.04] dark:hover:border-neutral-600"
                  >
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-muted text-brand transition-colors group-hover:bg-brand/10 dark:bg-brand/15 dark:text-red-400 dark:group-hover:bg-brand/20">
                      <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                    </div>
                    <p className="font-semibold tracking-tight text-foreground">{title}</p>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative -mx-4 pt-2 sm:-mx-6">
              <div className="rounded-2xl bg-neutral-100/95 px-4 py-10 sm:rounded-3xl sm:px-8 sm:py-12 dark:bg-neutral-950/55">
                <div className="mx-auto max-w-3xl">
                  <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft ring-1 ring-black/[0.04] dark:border-border dark:bg-card dark:ring-white/[0.06]">
                    <div className="border-l-[3px] border-brand">
                      <div className="px-6 pb-2 pt-8 sm:px-8 sm:pt-10">
                        <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
                          <Link
                            href="/"
                            className="flex shrink-0 justify-center sm:block sm:justify-start sm:pt-0.5"
                            aria-label="We Want The Truth — Home"
                          >
                            <SiteLogoMark size="md" />
                          </Link>
                          <div className="min-w-0 flex-1 space-y-5">
                            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-brand sm:text-left dark:text-red-400">
                              Who this is for
                            </p>
                            <p className="font-serif text-[1.35rem] font-medium leading-[1.38] tracking-tight text-foreground text-balance sm:text-[1.625rem] sm:leading-[1.36]">
                              If you have a dispute where your only option is to seek legal protection or enforcement, and
                              an institution, government agency, university, bank, or powerful financial organization is
                              using delay, cost, and bureaucracy to bleed you out, this is the tool built for you.
                            </p>
                            <p className="max-w-2xl text-pretty text-base leading-[1.75] text-neutral-800 dark:text-neutral-300">
                              We Want The Truth gives people a simple way to organize case documents, factual timelines,
                              evidence, public comments, and community review so the facts can be seen clearly.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4 border-t border-border/70 bg-neutral-50/90 px-6 py-6 sm:px-8 dark:bg-neutral-950/50">
                        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                          <Button
                            asChild
                            variant="destructive"
                            size="lg"
                            className="w-full shadow-soft-sm sm:w-auto sm:min-w-[13rem]"
                          >
                            <Link href="/secure-domain">Secure Your Case Domain</Link>
                          </Button>
                          <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="w-full border-border/90 bg-card sm:w-auto sm:min-w-[13rem]"
                          >
                            <Link href="/example-cases">See Example Case</Link>
                          </Button>
                        </div>
                        <p className="text-center text-[11px] font-medium uppercase tracking-wide text-muted-foreground sm:text-left">
                          No legal advice — software only.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <PlatformDisclaimer />
              <div className="rounded-xl border border-border/80 bg-card p-6 text-sm leading-relaxed text-neutral-700 shadow-soft-sm dark:border-border dark:bg-card dark:text-neutral-300">
                <p className="font-serif text-base font-semibold text-foreground">Platform statement</p>
                <p className="mt-3">
                  We founded this technology to give people a clear, structured, and accessible way to present the
                  facts. The software is free to manage. You own your data, your process, your content, and your
                  responsibility. We simply provide the tool.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
