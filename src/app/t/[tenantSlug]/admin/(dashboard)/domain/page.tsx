import { notFound } from "next/navigation";
import { getTenantAdminContext } from "@/lib/admin-auth";
import { provisionDnsStub } from "@/lib/domain-provision";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDomainPage({ params }: { params: { tenantSlug: string } }) {
  const ctx = await getTenantAdminContext(params.tenantSlug);
  if (!ctx) notFound();

  const domains = await prisma.tenantDomain.findMany({
    where: { tenantId: ctx.tenant.id },
    orderBy: { createdAt: "asc" },
  });

  const regs = await prisma.domainRegistration.findMany({
    where: { tenantId: ctx.tenant.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const primary = domains.find((d) => d.isPrimary)?.hostname ?? domains[0]?.hostname ?? "your-case-domain.com";
  const instructions = await provisionDnsStub(ctx.tenant.id, primary);

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-2xl font-bold">Domain</h1>
      <p className="mt-2 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">Mapped hostnames, SSL status, and DNS instructions from the provisioning abstraction.</p>

      <div className="mt-8 space-y-4">
        <h2 className="text-lg font-semibold">Hostnames</h2>
        <div className="overflow-x-auto rounded-sm border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
              <tr>
                <th className="px-3 py-2">Hostname</th>
                <th className="px-3 py-2">Primary</th>
                <th className="px-3 py-2">SSL</th>
              </tr>
            </thead>
            <tbody>
              {domains.map((d) => (
                <tr key={d.id} className="border-b border-neutral-100 dark:border-neutral-800">
                  <td className="px-3 py-2 font-mono text-xs">{d.hostname}</td>
                  <td className="px-3 py-2">{d.isPrimary ? "yes" : "no"}</td>
                  <td className="px-3 py-2">{d.sslStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="pt-6 text-lg font-semibold">DNS instructions (stub)</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-700 dark:text-neutral-300">
          {instructions.map((r, i) => (
            <li key={i}>
              {r.type} {r.name} → {r.value} {r.ttl ? `(TTL ${r.ttl})` : ""}
            </li>
          ))}
        </ul>

        <h2 className="pt-6 text-lg font-semibold">Domain registrations</h2>
        <ul className="text-sm text-neutral-700 dark:text-neutral-300">
          {regs.map((r) => (
            <li key={r.id}>
              {r.domainName} — {r.status} {r.costCents != null ? `(${(r.costCents / 100).toFixed(2)})` : ""}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
