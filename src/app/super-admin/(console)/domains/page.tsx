import { prisma } from "@/lib/prisma";
import { Globe, Lock, ShieldCheck, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SuperAdminDomainsPage() {
  const rows = await prisma.tenantDomain.findMany({
    include: { tenant: { select: { slug: true, name: true } } },
    orderBy: { hostname: "asc" },
    take: 500,
  });
  const primaryDomains = rows.filter((r) => r.isPrimary).length;
  const sslIssued = rows.filter((r) => (r.sslStatus || "").toLowerCase() === "issued").length;
  const sslPending = rows.length - sslIssued;

  return (
    <div className="h-full w-full">
      <div className="flex min-h-[calc(100vh-3rem)] flex-col rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-600">Infrastructure</p>
            <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">Domain Management</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600">
              All mapped hostnames across tenants. Wire Route53 / ACM jobs to keep <code>sslStatus</code> synchronized.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-neutral-600">
            <Sparkles className="h-3.5 w-3.5 text-red-500" aria-hidden />
            Total hostnames: {rows.length}
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:mt-6 sm:gap-4 sm:grid-cols-3">
          <article className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Primary domains</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-2xl font-semibold tracking-tight text-neutral-900">{primaryDomains}</p>
              <Globe className="h-5 w-5 text-red-500" aria-hidden />
            </div>
          </article>
          <article className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">SSL issued</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-2xl font-semibold tracking-tight text-neutral-900">{sslIssued}</p>
              <ShieldCheck className="h-5 w-5 text-green-600" aria-hidden />
            </div>
          </article>
          <article className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">SSL pending</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-2xl font-semibold tracking-tight text-neutral-900">{sslPending}</p>
              <Lock className="h-5 w-5 text-amber-600" aria-hidden />
            </div>
          </article>
        </div>

        <div className="mt-5 overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:mt-6">
          <table className="min-w-[760px] text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-600">
            <tr>
                <th className="px-4 py-3">Hostname</th>
                <th className="px-4 py-3">Tenant</th>
                <th className="px-4 py-3">Primary</th>
                <th className="px-4 py-3">SSL</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-neutral-100 align-top last:border-b-0">
                <td className="px-4 py-3.5">
                  <span className="font-mono text-xs text-neutral-800">{r.hostname}</span>
                </td>
                <td className="px-4 py-3.5 text-neutral-700">
                  {r.tenant.slug} — {r.tenant.name}
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={[
                      "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                      r.isPrimary ? "bg-emerald-100 text-emerald-700" : "bg-neutral-100 text-neutral-700",
                    ].join(" ")}
                  >
                    {r.isPrimary ? "yes" : "no"}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={[
                      "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                      (r.sslStatus || "").toLowerCase() === "issued" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700",
                    ].join(" ")}
                  >
                    {r.sslStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
