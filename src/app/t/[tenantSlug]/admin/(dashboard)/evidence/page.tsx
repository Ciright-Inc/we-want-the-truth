import { notFound } from "next/navigation";
import { getTenantAdminContext } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { EvidenceManager } from "@/components/admin/evidence-manager";

export const dynamic = "force-dynamic";

export default async function AdminEvidencePage({ params }: { params: { tenantSlug: string } }) {
  const ctx = await getTenantAdminContext(params.tenantSlug);
  if (!ctx) notFound();

  const list = await prisma.evidenceItem.findMany({
    where: { caseMatterId: ctx.caseMatter.id, deletedAt: null },
    orderBy: { evidenceDate: "desc" },
  });

  const rows = list.map((e) => ({
    id: e.id,
    title: e.title,
    exhibitLabel: e.exhibitLabel,
    evidenceDate: e.evidenceDate?.toISOString() ?? null,
    evidenceType: e.evidenceType,
    visibility: e.visibility,
    tags: e.tags,
    description: e.description,
    evidenceText: e.evidenceText,
    chainOfCustodyNotes: e.chainOfCustodyNotes,
  }));

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-2xl font-bold">Evidence</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Evidence library CRUD with exhibit labels and chain-of-custody notes.</p>
      <div className="mt-8">
        <EvidenceManager tenantSlug={params.tenantSlug} rows={rows} />
      </div>
    </div>
  );
}
