import { notFound } from "next/navigation";
import { getTenantAdminContext } from "@/lib/admin-auth";
import { tenantHasComments } from "@/lib/addons";
import { prisma } from "@/lib/prisma";
import { CommentsModerationTable } from "@/components/admin/comments-moderation-table";

export const dynamic = "force-dynamic";

export default async function AdminCommentsPage({ params }: { params: { tenantSlug: string } }) {
  const ctx = await getTenantAdminContext(params.tenantSlug);
  if (!ctx) notFound();

  const has = await tenantHasComments(ctx.tenant.id);
  if (!has) {
    return (
      <div className="p-6 lg:p-10">
        <h1 className="text-2xl font-bold">Comments</h1>
        <p className="mt-4 max-w-2xl rounded-sm border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-100">
          Comment management add-on is not active. Upgrade for approve, reject, hide, pin, export, search, and bulk moderation.
        </p>
      </div>
    );
  }

  const comments = await prisma.comment.findMany({
    where: { caseMatterId: ctx.caseMatter.id, deletedAt: null },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { email: true } } },
    take: 200,
  });

  const rows = comments.map((c) => ({
    id: c.id,
    body: c.body,
    status: c.status,
    pinned: c.pinned,
    createdAt: c.createdAt.toISOString(),
    userEmail: c.user.email,
  }));

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-2xl font-bold">Comment moderation</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">TanStack Table with per-row status, pin, and bulk actions.</p>
      <div className="mt-8">
        <CommentsModerationTable tenantSlug={params.tenantSlug} rows={rows} />
      </div>
    </div>
  );
}
