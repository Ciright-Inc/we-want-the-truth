import { PrismaClient, FileVisibility, CommentStatus, JuryPosition, PartyRole, UserRole, AddOnType, SubscriptionStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.videoPlayEvent.deleteMany();
  await prisma.pageView.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.abuseReport.deleteMany();
  await prisma.legalNotice.deleteMany();
  await prisma.subscriptionAddOn.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.domainRegistration.deleteMany();
  await prisma.juryVote.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.evidenceItem.deleteMany();
  await prisma.timelineItem.deleteMany();
  await prisma.document.deleteMany();
  await prisma.party.deleteMany();
  await prisma.caseMatter.deleteMany();
  await prisma.videoAsset.deleteMany();
  await prisma.fileAsset.deleteMany();
  await prisma.tenantDomain.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.systemSetting.deleteMany();

  const password = await bcrypt.hash("DevPassword!ChangeMe", 10);

  const superUser = await prisma.user.create({
    data: {
      email: "superadmin@we-want-the-truth.com",
      passwordHash: password,
      name: "Platform Super Admin",
      role: UserRole.SUPER_ADMIN,
    },
  });

  await prisma.systemSetting.createMany({
    data: [
      { key: "pricing.advanced_admin", value: 9.99 },
      { key: "pricing.video", value: 9.99 },
      { key: "pricing.comments", value: 9.99 },
      { key: "pricing.domain_setup", value: 49.99 },
      { key: "terms.version", value: "2026-05-01" },
    ],
  });

  async function seedTenant(input: {
    slug: string;
    name: string;
    adminEmail: string;
    publicHost: string;
    adminHost: string;
    title: string;
    summary: string;
    withVideo: boolean;
    commentsAddon: boolean;
  }) {
    const tenant = await prisma.tenant.create({
      data: {
        slug: input.slug,
        name: input.name,
        status: "ACTIVE",
        domains: {
          create: [
            { hostname: input.publicHost, isPrimary: true, sslStatus: "issued" },
            { hostname: input.adminHost, isPrimary: false, sslStatus: "issued" },
          ],
        },
      },
    });

    const admin = await prisma.user.create({
      data: {
        email: input.adminEmail,
        passwordHash: password,
        name: `${input.name} Admin`,
        role: UserRole.TENANT_ADMIN,
        tenantId: tenant.id,
        termsAcceptedAt: new Date(),
      },
    });

    await prisma.tenant.update({ where: { id: tenant.id }, data: { ownerId: admin.id } });

    const juror = await prisma.user.create({
      data: {
        email: `juror+${input.slug}@example.com`,
        passwordHash: password,
        name: "Registered Observer",
        role: UserRole.PUBLIC_USER,
        tenantId: tenant.id,
        termsAcceptedAt: new Date(),
      },
    });

    const cm = await prisma.caseMatter.create({
      data: {
        tenantId: tenant.id,
        title: input.title,
        caseSummary: input.summary,
        heroStatement: "Allegations are presented for public review. Nothing on this page is a court finding.",
        category: "Civil transparency",
        jurisdiction: "United States (illustrative)",
        courtOrForum: "Public record (this site)",
        matterNumber: `DEMO-${input.slug.toUpperCase()}`,
        statusLabel: "Active public record",
        themePreference: "dark",
        isPublicCase: true,
        allowAnonymousBrowsing: true,
        publicJuryEnabled: true,
        showAggregateVotes: true,
        commentModerationDefault: true,
        plaintiffLabel: "Plaintiff / claimant",
        defendantLabel: "Defendant / institution",
        counselNotes: "Counsel (if any) would be listed here.",
        totalViews: input.slug === "beanvspenn" ? 18420 : 9320,
        registeredUserCount: 42,
        parties: {
          create: [
            { role: PartyRole.PLAINTIFF, name: "Plaintiff party (alleged)", description: "Seeking relief as described in the public record.", sortOrder: 0 },
            { role: PartyRole.DEFENDANT, name: "Institutional respondent (alleged)", description: "Named as respondent in the underlying dispute narrative.", sortOrder: 1 },
            { role: PartyRole.COUNSEL, name: "Counsel (if applicable)", description: "Advisory capacity only; this platform is not a law firm.", sortOrder: 2 },
          ],
        },
        documents: {
          create: [
            {
              title: "Initial narrative filing (sample)",
              documentDate: new Date("2024-06-01"),
              filingType: "Narrative index",
              description: "Demonstration document metadata. Attach a PDF in production via admin.",
              source: "Party",
              visibility: FileVisibility.PUBLIC,
              tags: ["sample", "index"],
              viewCount: 1200,
            },
          ],
        },
        timelineItems: {
          create: [
            {
              eventDate: new Date("2024-05-10"),
              title: "Dispute crystallizes",
              shortSummary: "The claimant alleges a pattern of delay and cost escalation.\n\nThis card demonstrates paragraph spacing in the timeline.",
              fullDescription:
                "This is a longer factual description intended for the public record.\n\nIt includes multiple paragraphs so administrators can verify that paragraph breaks render correctly on the public site and in the full-window modal.\n\nAll statements on demonstration tenants are illustrative only.",
              category: "Narrative",
              visibility: FileVisibility.PUBLIC,
              featured: true,
              videoUrl: input.withVideo ? "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" : null,
            },
            {
              eventDate: new Date("2024-07-22"),
              title: "Correspondence logged",
              shortSummary: "Written correspondence is indexed with dates and sources.",
              fullDescription: "Demonstration entry without video. Expand and modal behaviors still apply.",
              category: "Correspondence",
              visibility: FileVisibility.PUBLIC,
            },
          ],
        },
        evidenceItems: {
          create: [
            {
              title: "Exhibit A (sample)",
              exhibitLabel: "A",
              evidenceDate: new Date("2024-06-15"),
              description: "Sample exhibit row for the evidence library.",
              evidenceText: "Evidence text can hold transcribed content with accountability notes.",
              evidenceType: "court filing",
              visibility: FileVisibility.PUBLIC,
              tags: ["exhibit"],
            },
          ],
        },
      },
    });

    await prisma.comment.create({
      data: {
        caseMatterId: cm.id,
        userId: juror.id,
        body: "This is an approved public comment demonstrating moderation output. It is not a legal conclusion.",
        status: CommentStatus.APPROVED,
      },
    });

    const u2 = await prisma.user.create({
      data: {
        email: `observer-a+${input.slug}@example.com`,
        passwordHash: password,
        role: UserRole.PUBLIC_USER,
        tenantId: tenant.id,
        termsAcceptedAt: new Date(),
      },
    });
    const u3 = await prisma.user.create({
      data: {
        email: `observer-b+${input.slug}@example.com`,
        passwordHash: password,
        role: UserRole.PUBLIC_USER,
        tenantId: tenant.id,
        termsAcceptedAt: new Date(),
      },
    });

    await prisma.juryVote.createMany({
      data: [
        { caseMatterId: cm.id, userId: juror.id, position: JuryPosition.FOR_PLAINTIFF },
        { caseMatterId: cm.id, userId: u2.id, position: JuryPosition.FOR_DEFENDANT },
        { caseMatterId: cm.id, userId: u3.id, position: JuryPosition.UNDECIDED },
      ],
    });

    const sub = await prisma.subscription.create({
      data: {
        tenantId: tenant.id,
        stripeCustomerId: `cus_seed_${tenant.id}`,
        stripeSubId: `sub_seed_${tenant.id}`,
        status: SubscriptionStatus.ACTIVE,
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 3600 * 1000),
      },
    });

    const addons: AddOnType[] = ["ADVANCED_ADMIN", "VIDEO_MANAGEMENT"];
    if (input.commentsAddon) addons.push("COMMENT_MANAGEMENT");

    await prisma.subscriptionAddOn.createMany({
      data: addons.map((type) => ({
        subscriptionId: sub.id,
        type,
        stripePriceId: `price_seed_${type}`,
        active: true,
      })),
    });

    if (input.withVideo) {
      const firstTl = await prisma.timelineItem.findFirst({
        where: { caseMatterId: cm.id },
        orderBy: { eventDate: "asc" },
      });
      await prisma.videoPlayEvent.create({
        data: {
          videoId: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
          timelineItemId: firstTl?.id,
          tenantId: tenant.id,
          userId: juror.id,
          secondsWatched: 42,
          completed: false,
        },
      });
    }

    return { tenant, cm, admin, juror };
  }

  await seedTenant({
    slug: "beanvspenn",
    name: "Bean vs Penn (demo)",
    adminEmail: "admin@beanvspenn.com",
    publicHost: "beanvspenn.com",
    adminHost: "admin.beanvspenn.com",
    title: "Bean vs Penn — demonstration matter",
    summary:
      "This demonstration tenant shows how a case summary authored in the admin console appears on the public site.\n\nParagraph breaks in the summary field are preserved for readability.\n\nAll party names and events are fictitious and for product illustration only.",
    withVideo: true,
    commentsAddon: true,
  });

  await seedTenant({
    slug: "cirightvscentili",
    name: "Ciright vs Centili (demo)",
    adminEmail: "admin@cirightvscentili.com",
    publicHost: "cirightvscentili.com",
    adminHost: "admin.cirightvscentili.com",
    title: "Ciright vs Centili — demonstration matter",
    summary:
      "Second seeded tenant for UI and analytics examples.\n\nUse the admin credentials printed in the README to verify that edits to this summary propagate to the public page at /t/cirightvscentili.",
    withVideo: false,
    commentsAddon: false,
  });

  // eslint-disable-next-line no-console
  console.log("Seed complete. Super admin:", superUser.email);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
