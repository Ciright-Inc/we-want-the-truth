import { prisma } from "@/lib/prisma";
import { tenantHasComments, tenantHasVideo } from "@/lib/addons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function TenantAdminDashboard({ params }: { params: { tenantSlug: string } }) {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: params.tenantSlug },
    include: {
      caseMatter: true,
      subscriptions: { include: { addOns: true } },
    },
  });
  if (!tenant?.caseMatter) return null;
  const cm = tenant.caseMatter;

  const [comments, pending, docs, timeline, evidence, plays] = await Promise.all([
    prisma.comment.count({ where: { caseMatterId: cm.id, deletedAt: null } }),
    prisma.comment.count({ where: { caseMatterId: cm.id, deletedAt: null, status: "PENDING" } }),
    prisma.document.count({ where: { caseMatterId: cm.id, deletedAt: null } }),
    prisma.timelineItem.count({ where: { caseMatterId: cm.id, deletedAt: null } }),
    prisma.evidenceItem.count({ where: { caseMatterId: cm.id, deletedAt: null } }),
    prisma.videoPlayEvent.count({ where: { tenantId: tenant.id } }),
  ]);

  const jury = await prisma.juryVote.groupBy({
    by: ["position"],
    where: { caseMatterId: cm.id },
    _count: { _all: true },
  });

  const sub = tenant.subscriptions[0];
  const hasComments = await tenantHasComments(tenant.id);
  const hasVideo = await tenantHasVideo(tenant.id);

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Operational snapshot for this tenant. All queries are scoped by tenant ID.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-neutral-500">Total views</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{cm.totalViews}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-neutral-500">Registered users</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{cm.registeredUserCount}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-neutral-500">Comments</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{comments}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-neutral-500">Pending comments</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{pending}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-neutral-500">Documents</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{docs}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-neutral-500">Timeline items</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{timeline}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-neutral-500">Evidence items</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{evidence}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-neutral-500">Video plays (events)</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{plays}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-neutral-500">Subscription</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">{sub?.status ?? "None"}</CardContent>
        </Card>
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Jury breakdown</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="space-y-1">
              {jury.map((j) => (
                <li key={j.position}>
                  {j.position}: {j._count._all}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Add-ons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Comment management: {hasComments ? "active" : "inactive"}</p>
            <p>Video management: {hasVideo ? "active" : "inactive"}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
