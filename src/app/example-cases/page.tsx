import Link from "next/link";
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
    <div className="flex min-h-screen flex-col bg-white text-black dark:bg-black dark:text-white">
      <SiteHeader />
      <main className="mx-auto max-w-6xl flex-1 px-4 py-14">
        <h1 className="text-3xl font-bold tracking-tight">Example Cases</h1>
        <p className="mt-3 max-w-2xl text-neutral-700 dark:text-neutral-300">
          Live-style demonstration tenants. Metrics are illustrative and reset when you re-seed your database.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {tenants.map((t) => {
            const cm = t.caseMatter;
            const primary = t.domains.find((d) => d.isPrimary)?.hostname ?? `${t.slug}.localhost`;
            const adminHost = t.domains.find((d) => d.hostname.startsWith("admin."))?.hostname ?? `admin.${primary}`;
            const sub = t.subscriptions[0];
            const c = cm?._count;
            return (
              <Card key={t.id}>
                <CardHeader>
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle>{t.name}</CardTitle>
                    <Badge variant="outline">{t.status}</Badge>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{cm?.title}</p>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Public URL:</span>{" "}
                    <Link className="text-red-700 underline dark:text-red-400" href={`/t/${t.slug}`}>
                      https://{primary}
                    </Link>{" "}
                    <span className="text-neutral-500">(dev: /t/{t.slug})</span>
                  </p>
                  <p>
                    <span className="font-medium">Admin URL:</span>{" "}
                    <Link className="text-red-700 underline dark:text-red-400" href={`/t/${t.slug}/admin`}>
                      https://{adminHost}
                    </Link>
                  </p>
                  <ul className="mt-3 grid grid-cols-2 gap-2 text-neutral-700 dark:text-neutral-300">
                    <li>Registered users: {cm?.registeredUserCount ?? "—"}</li>
                    <li>Total views: {cm?.totalViews ?? "—"}</li>
                    <li>Public votes: {c?.juryVotes ?? 0}</li>
                    <li>Documents: {c?.documents ?? 0}</li>
                    <li>Comments: {c?.comments ?? 0}</li>
                    <li>Add-ons: {sub?.addOns.filter((a) => a.active).length ?? 0}</li>
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
