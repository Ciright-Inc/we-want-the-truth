import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SuperAdminTenantsPage() {
  const tenants = await prisma.tenant.findMany({
    include: {
      domains: true,
      subscriptions: { take: 1, include: { addOns: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 lg:p-12">
      <h1 className="text-2xl font-bold">Tenants</h1>
      <div className="mt-6 overflow-x-auto rounded-sm border border-neutral-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase text-neutral-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Domains</th>
              <th className="px-4 py-3">Owner ID</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Add-ons</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((t) => (
              <tr key={t.id} className="border-b border-neutral-100">
                <td className="px-4 py-3 font-medium">{t.name}</td>
                <td className="px-4 py-3">{t.slug}</td>
                <td className="px-4 py-3 text-xs text-neutral-600">{t.domains.map((d) => d.hostname).join(", ")}</td>
                <td className="px-4 py-3 font-mono text-xs">{t.ownerId ?? "—"}</td>
                <td className="px-4 py-3">{t.status}</td>
                <td className="px-4 py-3 text-xs">{t.subscriptions[0]?.addOns.filter((a) => a.active).length ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
