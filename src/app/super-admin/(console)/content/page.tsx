import { prisma } from "@/lib/prisma";
import { AbuseRowActions, LegalRowActions } from "@/components/admin/super-admin-content-client";

export const dynamic = "force-dynamic";

export default async function SuperAdminContentPage() {
  const [reports, notices] = await Promise.all([
    prisma.abuseReport.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { reporter: { select: { email: true, name: true } } },
    }),
    prisma.legalNotice.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
  ]);

  return (
    <div className="p-8 lg:p-12">
      <h1 className="text-2xl font-bold">Content Oversight</h1>
      <p className="mt-3 max-w-2xl text-sm text-neutral-600">Abuse reports and legal notices. Status changes are audited in the database row history via `updatedAt` on related models where applicable.</p>

      <h2 className="mt-10 text-lg font-semibold">Abuse reports</h2>
      <div className="mt-3 overflow-x-auto rounded-sm border border-neutral-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase text-neutral-600">
            <tr>
              <th className="px-3 py-2">Created</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Target</th>
              <th className="px-3 py-2">Reporter</th>
              <th className="px-3 py-2">Reason</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id} className="border-b border-neutral-100 align-top">
                <td className="px-3 py-2 whitespace-nowrap text-xs text-neutral-500">{r.createdAt.toISOString().slice(0, 16)}</td>
                <td className="px-3 py-2 font-mono text-xs">{r.status}</td>
                <td className="px-3 py-2 font-mono text-xs">
                  {r.targetType} / {r.targetId}
                  {r.tenantId && <span className="block text-neutral-500">tenant {r.tenantId}</span>}
                </td>
                <td className="px-3 py-2 text-xs">{r.reporter?.email ?? "—"}</td>
                <td className="max-w-xs px-3 py-2 text-xs text-neutral-700">{r.reason.slice(0, 280)}{r.reason.length > 280 ? "…" : ""}</td>
                <td className="px-3 py-2">
                  <AbuseRowActions id={r.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 text-lg font-semibold">Legal notices</h2>
      <div className="mt-3 overflow-x-auto rounded-sm border border-neutral-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase text-neutral-600">
            <tr>
              <th className="px-3 py-2">Created</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Reference</th>
              <th className="px-3 py-2">Body</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notices.map((n) => (
              <tr key={n.id} className="border-b border-neutral-100 align-top">
                <td className="px-3 py-2 whitespace-nowrap text-xs text-neutral-500">{n.createdAt.toISOString().slice(0, 16)}</td>
                <td className="px-3 py-2 font-mono text-xs">{n.status}</td>
                <td className="px-3 py-2 text-xs">{n.reference ?? "—"}</td>
                <td className="max-w-md px-3 py-2 text-xs text-neutral-700">{n.body.slice(0, 400)}{n.body.length > 400 ? "…" : ""}</td>
                <td className="px-3 py-2">
                  <LegalRowActions id={n.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
