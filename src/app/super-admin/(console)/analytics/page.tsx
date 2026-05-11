import { prisma } from "@/lib/prisma";
import type { LucideIcon } from "lucide-react";
import { BarChart3, Building2, PlayCircle, Sparkles, Users, Vote, Waypoints } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SuperAdminAnalyticsPage() {
  const [tenants, users, pageViews, videoPlays, votes] = await Promise.all([
    prisma.tenant.count(),
    prisma.user.count(),
    prisma.pageView.count(),
    prisma.videoPlayEvent.count(),
    prisma.juryVote.count(),
  ]);

  const topTenants = await prisma.pageView.groupBy({
    by: ["tenantId"],
    where: { tenantId: { not: null } },
    _count: { _all: true },
    orderBy: { _count: { id: "desc" } },
    take: 10,
  });

  const tenantIds = topTenants.map((t) => t.tenantId).filter((id): id is string => id != null);
  const tenantNames = await prisma.tenant.findMany({
    where: { id: { in: tenantIds } },
    select: { id: true, slug: true },
  });
  const nameById = Object.fromEntries(tenantNames.map((t) => [t.id, t.slug]));
  const maxTopViews = Math.max(...topTenants.map((t) => t._count._all), 1);

  const now = new Date();
  const startMonth = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const monthlyViewsRaw = await prisma.$queryRaw<{ month: string; count: number }[]>`
    SELECT to_char(date_trunc('month', "createdAt"), 'YYYY-MM') AS month, COUNT(*)::int AS count
    FROM "PageView"
    WHERE "createdAt" >= ${startMonth}
    GROUP BY 1
    ORDER BY 1 ASC
  `;
  const viewsByMonth = new Map(monthlyViewsRaw.map((r) => [r.month, r.count]));
  const monthlyViews = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    return {
      month: d.toLocaleDateString("en-US", { month: "short" }),
      count: viewsByMonth.get(key) ?? 0,
    };
  });
  const maxMonthlyViews = Math.max(...monthlyViews.map((m) => m.count), 1);

  const statCards: Array<{ label: string; value: number; Icon: LucideIcon }> = [
    { label: "Tenants", value: tenants, Icon: Building2 },
    { label: "Users", value: users, Icon: Users },
    { label: "Page views", value: pageViews, Icon: Waypoints },
    { label: "Video plays", value: videoPlays, Icon: PlayCircle },
    { label: "Jury votes", value: votes, Icon: Vote },
  ];

  return (
    <div className="h-full w-full">
      <div className="flex min-h-[calc(100vh-3rem)] flex-col rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-600">Insights</p>
            <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">Visitors / Analytics</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600">
              Platform traffic and engagement metrics across tenants, including views, media activity, and voting signals.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-neutral-600">
            <Sparkles className="h-3.5 w-3.5 text-red-500" aria-hidden />
            Reporting window: live + monthly trend
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:mt-6 sm:gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {statCards.map(({ label, value, Icon }) => (
            <article key={label} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{label}</p>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-red-50 text-red-600">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
              </div>
              <p className="mt-2 text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl">{value}</p>
            </article>
          ))}
        </div>

        <div className="mt-5 grid flex-1 gap-3 sm:mt-6 sm:gap-4 xl:grid-cols-3">
          <section className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] xl:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-900">Monthly page views</p>
                <p className="text-xs text-neutral-500">Last 6 months</p>
              </div>
              <BarChart3 className="h-4 w-4 text-neutral-500" aria-hidden />
            </div>
            <div className="flex h-64 items-end gap-3 rounded-lg border border-neutral-100 bg-neutral-50/70 p-4">
              {monthlyViews.map((point) => (
                <div key={point.month} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex h-full w-full items-end justify-center">
                    <div
                      className="w-7 rounded-t-md bg-red-500/85"
                      style={{ height: `${Math.max(8, (point.count / maxMonthlyViews) * 100)}%` }}
                      title={`${point.count} views`}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-neutral-500">{point.month}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <p className="text-sm font-semibold text-neutral-900">Top tenants by views</p>
            <p className="mt-1 text-xs text-neutral-500">Ranked by logged page-view volume</p>
            <ol className="mt-4 space-y-3">
              {topTenants.length ? (
                topTenants.map((t, index) => (
                  <li key={String(t.tenantId)} className="rounded-lg border border-neutral-100 bg-neutral-50/70 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-neutral-900">
                        {index + 1}. {t.tenantId ? nameById[t.tenantId] ?? t.tenantId : "unknown"}
                      </p>
                      <span className="text-xs font-semibold text-neutral-700">{t._count._all}</span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-neutral-200">
                      <div
                        className="h-1.5 rounded-full bg-red-500/80"
                        style={{ width: `${Math.max(8, (t._count._all / maxTopViews) * 100)}%` }}
                      />
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-sm text-neutral-500">No tenant page-view data yet.</li>
              )}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
