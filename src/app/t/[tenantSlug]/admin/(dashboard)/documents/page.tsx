import { notFound } from "next/navigation";
import { getTenantAdminContext } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { DocumentsManager } from "@/components/admin/documents-manager";

export const dynamic = "force-dynamic";

export default async function AdminDocumentsPage({ params }: { params: { tenantSlug: string } }) {
  const ctx = await getTenantAdminContext(params.tenantSlug);
  if (!ctx) notFound();

  const docs = await prisma.document.findMany({
    where: { caseMatterId: ctx.caseMatter.id, deletedAt: null },
    orderBy: { documentDate: "desc" },
  });

  const rows = docs.map((d) => ({
    id: d.id,
    title: d.title,
    documentDate: d.documentDate?.toISOString() ?? null,
    filingType: d.filingType,
    visibility: d.visibility,
    tags: d.tags,
    fileAssetId: d.fileAssetId,
    description: d.description,
    source: d.source,
  }));

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-2xl font-bold">Documents</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Full CRUD with TanStack Table and React Hook Form + Zod.</p>
      <div className="mt-8">
        <DocumentsManager tenantSlug={params.tenantSlug} documents={rows} />
      </div>
    </div>
  );
}
