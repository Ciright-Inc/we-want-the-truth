import Link from "next/link";
import { Eye, FileText, MessageSquareText, ShieldCheck, Users, Vote } from "lucide-react";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ExampleCasesPage() {
  const tenants = await prisma.tenant.findMany({
    where: { slug: { in: ["beanvspenn", "cirightvscentili"] } },
    include: {
      caseMatter: {
        include: {
          _count: {
            select: { juryVotes: true, documents: true, comments: true },
          },
        },
      },
      domains: true,
      subscriptions: { include: { addOns: true } },
    },
  });

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="hero-surface flex-1 border-b border-border/60">
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-16">
          <div className="max-w-3xl space-y-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand dark:text-red-400">Case showcase</p>
            <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.65rem]">Example Cases</h1>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-[1.05rem]">
              Live-style demonstration tenants for exploring platform behavior. Metrics are illustrative and reset after database re-seed.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {tenants.map((t) => {
              const cm = t.caseMatter;
              const primary = t.domains.find((d) => d.isPrimary)?.hostname ?? `${t.slug}.localhost`;
              const adminHost = t.domains.find((d) => d.hostname.startsWith("admin."))?.hostname ?? `admin.${primary}`;
              const sub = t.subscriptions[0];
              const c = cm?._count;
              return (
                <Card
                  key={t.id}
                  className="h-full border-border/70 bg-card/95 shadow-soft-sm ring-1 ring-black/[0.02] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft dark:ring-white/[0.04]"
                >
                  <CardHeader className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-muted text-brand dark:bg-brand/15 dark:text-red-400">
                        <ShieldCheck className="h-5 w-5" aria-hidden />
                      </div>
                      <Badge variant="outline" className="font-medium">
                        {t.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="text-xl">{t.name}</CardTitle>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{cm?.title}</p>
                  </CardHeader>
                  <CardContent className="space-y-5 text-sm">
                    <div className="space-y-3 rounded-xl border border-border/70 bg-neutral-50/90 p-3.5 dark:bg-neutral-950/45">
                      <p className="leading-relaxed">
                        <span className="font-semibold text-foreground">Public URL:</span>{" "}
                        <Link className="font-medium text-brand underline decoration-brand/40 underline-offset-2 dark:text-red-400" href={`/t/${t.slug}`}>
                          https://{primary}
                        </Link>{" "}
                        <span className="text-muted-foreground">(dev: /t/{t.slug})</span>
                      </p>
                      <p className="leading-relaxed">
                        <span className="font-semibold text-foreground">Admin URL:</span>{" "}
                        <Link className="font-medium text-brand underline decoration-brand/40 underline-offset-2 dark:text-red-400" href={`/t/${t.slug}/admin`}>
                          https://{adminHost}
                        </Link>
                      </p>
                    </div>

                    <ul className="grid grid-cols-2 gap-3 text-muted-foreground">
                      <li className="rounded-lg border border-border/70 bg-card px-3 py-2">
                        <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide"><Users className="h-3.5 w-3.5" /> Users</p>
                        <p className="mt-1 text-base font-semibold text-foreground">{cm?.registeredUserCount ?? "—"}</p>
                      </li>
                      <li className="rounded-lg border border-border/70 bg-card px-3 py-2">
                        <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide"><Eye className="h-3.5 w-3.5" /> Views</p>
                        <p className="mt-1 text-base font-semibold text-foreground">{cm?.totalViews ?? "—"}</p>
                      </li>
                      <li className="rounded-lg border border-border/70 bg-card px-3 py-2">
                        <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide"><Vote className="h-3.5 w-3.5" /> Votes</p>
                        <p className="mt-1 text-base font-semibold text-foreground">{c?.juryVotes ?? 0}</p>
                      </li>
                      <li className="rounded-lg border border-border/70 bg-card px-3 py-2">
                        <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide"><FileText className="h-3.5 w-3.5" /> Docs</p>
                        <p className="mt-1 text-base font-semibold text-foreground">{c?.documents ?? 0}</p>
                      </li>
                      <li className="rounded-lg border border-border/70 bg-card px-3 py-2">
                        <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide"><MessageSquareText className="h-3.5 w-3.5" /> Comments</p>
                        <p className="mt-1 text-base font-semibold text-foreground">{c?.comments ?? 0}</p>
                      </li>
                      <li className="rounded-lg border border-border/70 bg-card px-3 py-2">
                        <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide">Add-ons</p>
                        <p className="mt-1 text-base font-semibold text-foreground">{sub?.addOns.filter((a) => a.active).length ?? 0}</p>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
