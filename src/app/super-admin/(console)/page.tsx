import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SuperAdminOverviewPage() {
  const [tenants, users, views] = await Promise.all([prisma.tenant.count(), prisma.user.count(), prisma.pageView.count()]);

  return (
    <div className="p-8 lg:p-12">
      <h1 className="text-3xl font-bold">Overview</h1>
      <p className="mt-2 text-sm text-neutral-600">Platform-wide metrics (tenant-isolated detail in sub-pages).</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-sm border border-neutral-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-neutral-500">Tenants</p>
          <p className="mt-2 text-2xl font-bold">{tenants}</p>
        </div>
        <div className="rounded-sm border border-neutral-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-neutral-500">Registered users</p>
          <p className="mt-2 text-2xl font-bold">{users}</p>
        </div>
        <div className="rounded-sm border border-neutral-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-neutral-500">Page views (logged)</p>
          <p className="mt-2 text-2xl font-bold">{views}</p>
        </div>
        <div className="rounded-sm border border-neutral-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-neutral-500">MRR</p>
          <p className="mt-2 text-2xl font-bold">—</p>
          <p className="mt-1 text-xs text-neutral-500">Wire Stripe reporting for live MRR.</p>
        </div>
      </div>
    </div>
  );
}
