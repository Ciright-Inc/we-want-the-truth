import { notFound } from "next/navigation";
import { getTenantAdminContext } from "@/lib/admin-auth";
import { JuryAdminPanel } from "@/components/admin/jury-admin-panel";

export const dynamic = "force-dynamic";

export default async function AdminJuryPage({ params }: { params: { tenantSlug: string } }) {
  const ctx = await getTenantAdminContext(params.tenantSlug);
  if (!ctx) notFound();
  const cm = ctx.caseMatter;

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-2xl font-bold">Public Jury</h1>
      <p className="mt-2 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">Control public voting visibility and export anonymized vote rows for analysis.</p>
      <div className="mt-8">
        <JuryAdminPanel tenantSlug={params.tenantSlug} publicJuryEnabled={cm.publicJuryEnabled} showAggregateVotes={cm.showAggregateVotes} />
      </div>
    </div>
  );
}
