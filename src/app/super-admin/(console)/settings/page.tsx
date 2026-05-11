import { prisma } from "@/lib/prisma";
import { SystemSettingUpsertForm } from "@/components/admin/super-admin-settings-client";

export const dynamic = "force-dynamic";

export default async function SuperAdminSettingsPage() {
  const rows = await prisma.systemSetting.findMany({ orderBy: { key: "asc" }, take: 200 });
  const serializable = rows.map((r) => ({
    key: r.key,
    value: r.value,
    updatedAt: r.updatedAt.toISOString(),
  }));

  return (
    <div className="p-8 lg:p-12">
      <h1 className="text-2xl font-bold">Product Settings</h1>
      <p className="mt-3 max-w-2xl text-sm text-neutral-600">Global key/value JSON stored in `SystemSetting`. Use for feature flags, pricing copy, maintenance messages, and terms version pointers.</p>

      <SystemSettingUpsertForm initialRows={serializable} />

      <h2 className="mt-12 text-lg font-semibold">Current keys</h2>
      <div className="mt-3 overflow-x-auto rounded-sm border border-neutral-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase text-neutral-600">
            <tr>
              <th className="px-3 py-2">Key</th>
              <th className="px-3 py-2">Updated</th>
              <th className="px-3 py-2">Value (JSON)</th>
            </tr>
          </thead>
          <tbody>
            {serializable.map((r) => (
              <tr key={r.key} className="border-b border-neutral-100 align-top">
                <td className="px-3 py-2 font-mono text-xs">{r.key}</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-neutral-500">{r.updatedAt.slice(0, 16)}</td>
                <td className="max-w-2xl px-3 py-2 font-mono text-xs break-all text-neutral-800">{JSON.stringify(r.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
