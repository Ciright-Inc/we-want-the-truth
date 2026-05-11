import { prisma } from "@/lib/prisma";
import { FileVisibility } from "@prisma/client";

export async function getPublicCaseBySlug(slug: string) {
  const tenant = await prisma.tenant.findUnique({
    where: { slug, suspended: false, status: "ACTIVE" },
    include: {
      caseMatter: {
        include: {
          parties: { orderBy: { sortOrder: "asc" } },
          documents: {
            where: { deletedAt: null, visibility: FileVisibility.PUBLIC },
            orderBy: { documentDate: "desc" },
            include: { fileAsset: true },
          },
          timelineItems: {
            where: { deletedAt: null, visibility: FileVisibility.PUBLIC },
            orderBy: { eventDate: "desc" },
          },
          evidenceItems: {
            where: { deletedAt: null, visibility: FileVisibility.PUBLIC },
            orderBy: { evidenceDate: "desc" },
          },
          comments: {
            where: { deletedAt: null, status: "APPROVED" },
            include: { user: { select: { name: true, email: true } } },
            orderBy: { createdAt: "desc" },
            take: 50,
          },
        },
      },
      domains: true,
      subscriptions: {
        where: { status: { in: ["ACTIVE", "TRIALING"] } },
        include: { addOns: { where: { active: true } } },
        take: 1,
      },
    },
  });

  if (!tenant?.caseMatter || tenant.caseMatter.deletedAt) return null;
  const cm = tenant.caseMatter;
  if (!cm.isPublicCase) return null;

  const juryVotes = await prisma.juryVote.findMany({
    where: { caseMatterId: cm.id },
    select: { position: true },
  });

  const sub = tenant.subscriptions[0];
  const addOns = sub?.addOns.map((a) => a.type) ?? [];

  const juryTotals = {
    FOR_PLAINTIFF: juryVotes.filter((v) => v.position === "FOR_PLAINTIFF").length,
    FOR_DEFENDANT: juryVotes.filter((v) => v.position === "FOR_DEFENDANT").length,
    UNDECIDED: juryVotes.filter((v) => v.position === "UNDECIDED").length,
  };

  return {
    tenant: { id: tenant.id, slug: tenant.slug, name: tenant.name },
    caseMatter: cm,
    domains: tenant.domains,
    comments: cm.comments,
    juryTotals,
    features: {
      commentManagement: addOns.includes("COMMENT_MANAGEMENT"),
      videoManagement: addOns.includes("VIDEO_MANAGEMENT"),
      showVotes: cm.showAggregateVotes && cm.publicJuryEnabled,
    },
  };
}
