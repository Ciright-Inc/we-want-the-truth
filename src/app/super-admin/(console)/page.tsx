import { prisma } from "@/lib/prisma";
import { Building2, CreditCard, Eye, TrendingUp, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SuperAdminOverviewPage() {
  const now = new Date();
  const startMonth = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [tenants, users, views, viewsByMonthRaw, usersByMonthRaw] = await Promise.all([
    prisma.tenant.count(),
    prisma.user.count(),
    prisma.pageView.count(),
    prisma.$queryRaw<{ month: string; count: number }[]>`
      SELECT to_char(date_trunc('month', "createdAt"), 'YYYY-MM') AS month, COUNT(*)::int AS count
      FROM "PageView"
      WHERE "createdAt" >= ${startMonth}
      GROUP BY 1
      ORDER BY 1 ASC
    `,
    prisma.$queryRaw<{ month: string; count: number }[]>`
      SELECT to_char(date_trunc('month', "createdAt"), 'YYYY-MM') AS month, COUNT(*)::int AS count
      FROM "User"
      WHERE "createdAt" >= ${startMonth}
      GROUP BY 1
      ORDER BY 1 ASC
    `,
  ]);

  const viewsByMonth = new Map(viewsByMonthRaw.map((r) => [r.month, r.count]));
  const usersByMonth = new Map(usersByMonthRaw.map((r) => [r.month, r.count]));

  const trendData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    return {
      month: d.toLocaleDateString("en-US", { month: "short" }),
      views: viewsByMonth.get(key) ?? 0,
      users: usersByMonth.get(key) ?? 0,
    };
  });

  const maxViews = Math.max(...trendData.map((d) => d.views), 1);
  const maxUsers = Math.max(...trendData.map((d) => d.users), 1);
  const hasViewData = trendData.some((d) => d.views > 0);
  const hasUserData = trendData.some((d) => d.users > 0);
  const kpis = [
    {
      label: "Tenants",
      value: tenants.toLocaleString(),
      icon: Building2,
      note: "Active and setup tenants",
    },
    {
      label: "Registered users",
      value: users.toLocaleString(),
      icon: Users,
      note: "Total platform accounts",
    },
    {
      label: "Page views (logged)",
      value: views.toLocaleString(),
      icon: Eye,
      note: "Recorded page-view events",
    },
    {
      label: "MRR",
      value: "—",
      icon: CreditCard,
      note: "Connect Stripe reporting for live MRR",
    },
  ];

  return (
    <div className="h-full w-full">
      <div className="flex min-h-[calc(100vh-3rem)] flex-col rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-600">Platform dashboard</p>
            <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">Overview</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600">
              Platform-wide metrics for operator visibility. Tenant-level details remain isolated in each sub-page.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-neutral-600">
            <TrendingUp className="h-3.5 w-3.5 text-red-500" aria-hidden />
            Last refreshed: {new Date().toLocaleString()}
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:mt-6 sm:gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => (
            <article
              key={kpi.label}
              className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] ring-1 ring-black/[0.02]"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{kpi.label}</p>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-red-50 text-red-600">
                  <kpi.icon className="h-4 w-4" aria-hidden />
                </span>
              </div>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 sm:mt-3 sm:text-3xl">{kpi.value}</p>
              <p className="mt-2 text-xs leading-relaxed text-neutral-500">{kpi.note}</p>
            </article>
          ))}
        </div>

        <div className="mt-5 grid flex-1 gap-3 sm:mt-6 sm:gap-4 xl:grid-cols-3">
          <section className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] xl:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-900">Traffic Trend</p>
                <p className="text-xs text-neutral-500">Monthly logged page views</p>
              </div>
              <p className="text-xs font-medium text-neutral-500">Last 6 months</p>
            </div>
            <div className="flex h-44 items-end gap-3 rounded-lg border border-neutral-100 bg-neutral-50/70 p-3 sm:h-64 sm:p-4">
              {hasViewData ? (
                trendData.map((point) => (
                  <div key={point.month} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex h-full w-full items-end justify-center">
                      <div
                        className="w-5 rounded-t-md bg-red-500/85 sm:w-7"
                        style={{ height: `${Math.max(8, (point.views / maxViews) * 100)}%` }}
                        title={`${point.views} views`}
                      />
                    </div>
                    <span className="text-[11px] font-medium text-neutral-500">{point.month}</span>
                  </div>
                ))
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-md border border-dashed border-neutral-200 bg-white/70">
                  <p className="text-xs font-medium text-neutral-500">No page-view data yet</p>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <p className="text-sm font-semibold text-neutral-900">User Growth</p>
            <p className="mt-1 text-xs text-neutral-500">Monthly registered users trend</p>
            <div className="mt-4 space-y-3">
              {trendData.map((point) => (
                <div key={`${point.month}-users`}>
                  <div className="mb-1 flex items-center justify-between text-[11px] text-neutral-500">
                    <span>{point.month}</span>
                    <span>{point.users}</span>
                  </div>
                  <div className="h-2 rounded-full bg-neutral-100">
                    <div
                      className="h-2 rounded-full bg-neutral-800"
                      style={{ width: hasUserData ? `${Math.max(4, (point.users / maxUsers) * 100)}%` : "0%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {!hasUserData ? <p className="mt-3 text-xs font-medium text-neutral-500">No user-growth data yet</p> : null}
          </section>
        </div>
      </div>
    </div>
  );
}
