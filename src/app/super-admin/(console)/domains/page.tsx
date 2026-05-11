import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SuperAdminDomainsPage() {
  const rows = await prisma.tenantDomain.findMany({
    include: { tenant: { select: { slug: true, name: true } } },
    orderBy: { hostname: "asc" },
    take: 500,
  });

  return (
    <div className="p-8 lg:p-12">
      <h1 className="text-2xl font-bold">Domain Management</h1>
      <p className="mt-3 max-w-2xl text-sm text-neutral-600">All mapped hostnames across tenants. Wire Route53 / ACM jobs to update `sslStatus`.</p>
      <div className="mt-8 overflow-x-auto rounded-sm border border-neutral-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase text-neutral-600">
            <tr>
              <th className="px-4 py-3">Hostname</th>
              <th className="px-4 py-3">Tenant</th>
              <th className="px-4 py-3">Primary</th>
              <th className="px-4 py-3">SSL</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-neutral-100">
                <td className="px-4 py-3 font-mono text-xs">{r.hostname}</td>
                <td className="px-4 py-3">
                  {r.tenant.slug} — {r.tenant.name}
                </td>
                <td className="px-4 py-3">{r.isPrimary ? "yes" : "no"}</td>
                <td className="px-4 py-3">{r.sslStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
