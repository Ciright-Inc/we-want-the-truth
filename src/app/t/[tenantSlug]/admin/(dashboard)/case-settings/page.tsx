import { notFound } from "next/navigation";
import { getTenantAdminContext } from "@/lib/admin-auth";
import { CaseSettingsForm } from "@/components/admin/case-settings-form";
import type { z } from "zod";
import type { caseSettingsSchema } from "@/lib/validators/admin";

export const dynamic = "force-dynamic";

type FormValues = z.infer<typeof caseSettingsSchema>;

export default async function CaseSettingsPage({ params }: { params: { tenantSlug: string } }) {
  const ctx = await getTenantAdminContext(params.tenantSlug);
  if (!ctx) notFound();
  const cm = ctx.caseMatter;

  const defaultValues: FormValues = {
    title: cm.title,
    caseSummary: cm.caseSummary,
    heroStatement: cm.heroStatement ?? "",
    category: cm.category ?? "",
    jurisdiction: cm.jurisdiction ?? "",
    courtOrForum: cm.courtOrForum ?? "",
    matterNumber: cm.matterNumber ?? "",
    statusLabel: cm.statusLabel ?? "",
    logoUrl: cm.logoUrl ?? "",
    themePreference: cm.themePreference === "light" ? "light" : "dark",
    isPublicCase: cm.isPublicCase,
    allowAnonymousBrowsing: cm.allowAnonymousBrowsing,
    publicJuryEnabled: cm.publicJuryEnabled,
    showAggregateVotes: cm.showAggregateVotes,
    commentModerationDefault: cm.commentModerationDefault,
    plaintiffLabel: cm.plaintiffLabel ?? "",
    defendantLabel: cm.defendantLabel ?? "",
    counselNotes: cm.counselNotes ?? "",
    parties: cm.parties.map((p) => ({
      id: p.id,
      role: p.role,
      name: p.name,
      description: p.description ?? "",
      sortOrder: p.sortOrder,
    })),
  };

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-2xl font-bold">Case Settings</h1>
      <p className="mt-2 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">All fields are validated with Zod and saved through a tenant-scoped server action (audit logged).</p>
      <div className="mt-8">
        <CaseSettingsForm tenantSlug={params.tenantSlug} defaultValues={defaultValues} />
      </div>
    </div>
  );
}
