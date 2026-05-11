import { prisma } from "@/lib/prisma";
import { SystemSettingUpsertForm } from "@/components/admin/super-admin-settings-client";
import { Cog, KeyRound, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SuperAdminSettingsPage() {
  const rows = await prisma.systemSetting.findMany({ orderBy: { key: "asc" }, take: 200 });
  const serializable = rows.map((r) => ({
    key: r.key,
    value: r.value,
    updatedAt: r.updatedAt.toISOString(),
  }));
  const recentKeys = serializable.filter((r) => {
    const age = Date.now() - new Date(r.updatedAt).getTime();
    return age <= 7 * 24 * 60 * 60 * 1000;
  }).length;

  return (
    <div className="h-full w-full">
      <div className="flex min-h-[calc(100vh-3rem)] flex-col rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-600">Configuration</p>
            <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">Product Settings</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600">
              Global JSON key/value registry stored in <code>SystemSetting</code> for feature flags, pricing copy, maintenance banners, and version pointers.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-neutral-600">
            <Sparkles className="h-3.5 w-3.5 text-red-500" aria-hidden />
            Keys loaded: {serializable.length}
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:mt-6 sm:gap-4 sm:grid-cols-3">
          <article className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Total keys</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-2xl font-semibold tracking-tight text-neutral-900">{serializable.length}</p>
              <KeyRound className="h-5 w-5 text-red-500" aria-hidden />
            </div>
          </article>
          <article className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Recently updated (7 days)</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-2xl font-semibold tracking-tight text-neutral-900">{recentKeys}</p>
              <Cog className="h-5 w-5 text-neutral-700" aria-hidden />
            </div>
          </article>
        </div>

        <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-5">
          <SystemSettingUpsertForm initialRows={serializable} />
        </div>

        <h2 className="mt-10 text-base font-semibold text-neutral-900 sm:text-lg">Current keys</h2>
        <div className="mt-3 overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <table className="min-w-[760px] text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-600">
            <tr>
              <th className="px-3 py-2">Key</th>
              <th className="px-3 py-2">Updated</th>
              <th className="px-3 py-2">Value (JSON)</th>
            </tr>
          </thead>
          <tbody>
            {serializable.map((r) => (
              <tr key={r.key} className="border-b border-neutral-100 align-top last:border-b-0">
                <td className="px-3 py-2">
                  <span className="inline-flex rounded-md bg-neutral-100 px-2 py-1 font-mono text-xs text-neutral-700">{r.key}</span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-neutral-500">{r.updatedAt.slice(0, 16)}</td>
                <td className="max-w-2xl px-3 py-2 font-mono text-xs break-all text-neutral-800">{JSON.stringify(r.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}
