import { prisma } from "@/lib/prisma";
import { AbuseRowActions, LegalRowActions } from "@/components/admin/super-admin-content-client";
import { AlertTriangle, Gavel, ShieldAlert, Sparkles } from "lucide-react";

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
  const openReports = reports.filter((r) => r.status === "open").length;
  const openNotices = notices.filter((n) => n.status === "queued").length;

  return (
    <div className="h-full w-full">
      <div className="flex min-h-[calc(100vh-3rem)] flex-col rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-600">Governance</p>
            <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">Content Oversight</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600">
              Abuse reports and legal notices. Status transitions are tracked through row timestamps and moderation actions.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-neutral-600">
            <Sparkles className="h-3.5 w-3.5 text-red-500" aria-hidden />
            Oversight queue: live
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:mt-6 sm:gap-4 sm:grid-cols-3">
          <article className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Abuse reports</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-2xl font-semibold tracking-tight text-neutral-900">{reports.length}</p>
              <ShieldAlert className="h-5 w-5 text-red-500" aria-hidden />
            </div>
          </article>
          <article className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Open reports</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-2xl font-semibold tracking-tight text-neutral-900">{openReports}</p>
              <AlertTriangle className="h-5 w-5 text-amber-600" aria-hidden />
            </div>
          </article>
          <article className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Queued legal notices</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-2xl font-semibold tracking-tight text-neutral-900">{openNotices}</p>
              <Gavel className="h-5 w-5 text-neutral-700" aria-hidden />
            </div>
          </article>
        </div>

        <h2 className="mt-8 text-base font-semibold text-neutral-900 sm:text-lg">Abuse reports</h2>
        <div className="mt-3 overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <table className="min-w-[860px] text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-600">
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
              <tr key={r.id} className="border-b border-neutral-100 align-top last:border-b-0">
                <td className="px-3 py-2 whitespace-nowrap text-xs text-neutral-500">{r.createdAt.toISOString().slice(0, 16)}</td>
                <td className="px-3 py-2">
                  <span
                    className={[
                      "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                      r.status === "open" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700",
                    ].join(" ")}
                  >
                    {r.status}
                  </span>
                </td>
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

      <h2 className="mt-10 text-base font-semibold text-neutral-900 sm:text-lg">Legal notices</h2>
      <div className="mt-3 overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <table className="min-w-[860px] text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-600">
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
              <tr key={n.id} className="border-b border-neutral-100 align-top last:border-b-0">
                <td className="px-3 py-2 whitespace-nowrap text-xs text-neutral-500">{n.createdAt.toISOString().slice(0, 16)}</td>
                <td className="px-3 py-2">
                  <span
                    className={[
                      "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                      n.status === "queued" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700",
                    ].join(" ")}
                  >
                    {n.status}
                  </span>
                </td>
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
    </div>
  );
}
