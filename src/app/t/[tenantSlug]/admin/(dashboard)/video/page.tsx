import { notFound } from "next/navigation";
import { getTenantAdminContext } from "@/lib/admin-auth";
import { tenantHasVideo } from "@/lib/addons";
import { prisma } from "@/lib/prisma";
import { VideoAdminPanel } from "@/components/admin/video-admin-panel";

export const dynamic = "force-dynamic";

export default async function AdminVideoPage({ params }: { params: { tenantSlug: string } }) {
  const ctx = await getTenantAdminContext(params.tenantSlug);
  if (!ctx) notFound();

  const has = await tenantHasVideo(ctx.tenant.id);
  if (!has) {
    return (
      <div className="p-6 lg:p-10">
        <h1 className="text-2xl font-bold">Video Management</h1>
        <p className="mt-4 max-w-2xl rounded-sm border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-100">
          Video management add-on is not active. Upgrade for uploads, embeds, timeline attachment, analytics, thumbnails, and privacy controls.
        </p>
      </div>
    );
  }

  const tenantId = ctx.tenant.id;
  const [totalPlays, completions, loggedInGroups, anonGroups, assets] = await Promise.all([
    prisma.videoPlayEvent.count({ where: { tenantId } }),
    prisma.videoPlayEvent.count({ where: { tenantId, completed: true } }),
    prisma.videoPlayEvent.groupBy({ by: ["userId"], where: { tenantId, userId: { not: null } }, _count: true }),
    prisma.videoPlayEvent.groupBy({ by: ["anonymousSession"], where: { tenantId, userId: null, anonymousSession: { not: null } }, _count: true }),
    prisma.videoAsset.findMany({
      where: { tenantId, deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
  ]);

  const stats = {
    totalPlays,
    uniqueLoggedIn: loggedInGroups.length,
    uniqueAnonymous: anonGroups.length,
    completions,
  };

  const assetRows = assets.map((a) => ({
    id: a.id,
    title: a.title,
    embedUrl: a.embedUrl,
    createdAt: a.createdAt.toISOString(),
  }));

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-2xl font-bold">Video Management</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Analytics from `VideoPlayEvent` plus video asset records.</p>
      <div className="mt-8">
        <VideoAdminPanel tenantSlug={params.tenantSlug} stats={stats} assets={assetRows} />
      </div>
    </div>
  );
}
