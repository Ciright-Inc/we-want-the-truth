import { prisma } from "@/lib/prisma";
import { Building2, Globe, ShieldCheck, Sparkles, UserCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SuperAdminTenantsPage() {
  const tenants = await prisma.tenant.findMany({
    include: {
      domains: true,
      subscriptions: { take: 1, include: { addOns: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const activeTenants = tenants.filter((t) => t.status === "ACTIVE").length;
  const totalDomains = tenants.reduce((sum, t) => sum + t.domains.length, 0);
  const totalAddOns = tenants.reduce((sum, t) => sum + (t.subscriptions[0]?.addOns.filter((a) => a.active).length ?? 0), 0);

  return (
    <div className="h-full w-full">
      <div className="flex min-h-[calc(100vh-3rem)] flex-col rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-600">Platform directory</p>
            <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">Tenants</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600">
              Central view of tenant workspaces, domains, ownership mapping, and add-on activation.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-neutral-600">
            <Sparkles className="h-3.5 w-3.5 text-red-500" aria-hidden />
            Total tenants: {tenants.length}
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:mt-6 sm:gap-4 sm:grid-cols-3">
          <article className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Active tenants</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-2xl font-semibold tracking-tight text-neutral-900">{activeTenants}</p>
              <Building2 className="h-5 w-5 text-red-500" aria-hidden />
            </div>
          </article>
          <article className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Mapped domains</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-2xl font-semibold tracking-tight text-neutral-900">{totalDomains}</p>
              <Globe className="h-5 w-5 text-red-500" aria-hidden />
            </div>
          </article>
          <article className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Active add-ons</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-2xl font-semibold tracking-tight text-neutral-900">{totalAddOns}</p>
              <ShieldCheck className="h-5 w-5 text-red-500" aria-hidden />
            </div>
          </article>
        </div>

        <div className="mt-5 overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:mt-6">
          <table className="min-w-[840px] text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-600">
            <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Domains</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Add-ons</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((t) => (
              <tr key={t.id} className="border-b border-neutral-100 align-top last:border-b-0">
                <td className="px-4 py-3.5">
                  <p className="font-medium text-neutral-900">{t.name}</p>
                </td>
                <td className="px-4 py-3.5">
                  <span className="inline-flex rounded-md bg-neutral-100 px-2 py-1 font-medium text-neutral-700">{t.slug}</span>
                </td>
                <td className="px-4 py-3.5 text-xs leading-relaxed text-neutral-600">
                  {t.domains.length ? t.domains.map((d) => d.hostname).join(", ") : "—"}
                </td>
                <td className="px-4 py-3.5">
                  {t.ownerId ? (
                    <div className="inline-flex items-center gap-1.5 rounded-md bg-neutral-50 px-2 py-1 text-xs text-neutral-700">
                      <UserCircle2 className="h-3.5 w-3.5" aria-hidden />
                      <span className="font-mono">{t.ownerId}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-neutral-500">—</span>
                  )}
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={[
                      "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                      t.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700",
                    ].join(" ")}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-xs font-semibold text-neutral-700">
                  {t.subscriptions[0]?.addOns.filter((a) => a.active).length ?? 0}
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
