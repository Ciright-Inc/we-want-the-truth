import { notFound } from "next/navigation";
import { getTenantAdminContext } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { TimelineManager } from "@/components/admin/timeline-manager";

export const dynamic = "force-dynamic";

export default async function AdminTimelinePage({ params }: { params: { tenantSlug: string } }) {
  const ctx = await getTenantAdminContext(params.tenantSlug);
  if (!ctx) notFound();

  const items = await prisma.timelineItem.findMany({
    where: { caseMatterId: ctx.caseMatter.id, deletedAt: null },
    orderBy: { eventDate: "desc" },
  });

  const rows = items.map((i) => ({
    id: i.id,
    eventDate: i.eventDate.toISOString(),
    title: i.title,
    shortSummary: i.shortSummary,
    fullDescription: i.fullDescription,
    category: i.category,
    visibility: i.visibility,
    featured: i.featured,
    videoUrl: i.videoUrl,
    audioFileUrl: i.audioFileUrl,
    imageUrls: i.imageUrls,
  }));

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-2xl font-bold">Timeline</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">CRUD with optional live preview using the same public timeline card component.</p>
      <div className="mt-8">
        <TimelineManager tenantSlug={params.tenantSlug} items={rows} />
      </div>
    </div>
  );
}
