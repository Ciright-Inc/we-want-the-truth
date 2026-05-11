import { prisma } from "@/lib/prisma";

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

  return (
    <div className="p-8 lg:p-12">
      <h1 className="text-2xl font-bold">Visitors / Analytics</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ["Tenants", tenants],
          ["Users", users],
          ["Page views", pageViews],
          ["Video plays", videoPlays],
          ["Jury votes", votes],
        ].map(([label, n]) => (
          <div key={String(label)} className="rounded-sm border border-neutral-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase text-neutral-500">{label}</p>
            <p className="mt-2 text-2xl font-bold">{n as number}</p>
          </div>
        ))}
      </div>
      <h2 className="mt-10 text-lg font-semibold">Top tenants by page views</h2>
      <ol className="mt-3 list-decimal space-y-1 pl-6 text-sm text-neutral-700">
        {topTenants.map((t) => (
          <li key={String(t.tenantId)}>
            {t.tenantId ? nameById[t.tenantId] ?? t.tenantId : "null"} — {t._count._all} views
          </li>
        ))}
      </ol>
    </div>
  );
}
