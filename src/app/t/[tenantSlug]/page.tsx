import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getPublicCaseBySlug } from "@/lib/get-public-case";
import { prisma } from "@/lib/prisma";
import { PlatformDisclaimer } from "@/components/legal-disclaimer";
import { SummaryParagraphs } from "@/components/summary-paragraphs";
import { CaseTimelineClient } from "@/components/tenant/case-timeline-client";
import { CommentSection } from "@/components/tenant/comment-section";
import { JurySection } from "@/components/tenant/jury-section";
import { PageViewTracker } from "@/components/tenant/page-view-tracker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TimelineRow } from "@/components/tenant/timeline-section";

export const dynamic = "force-dynamic";

export default async function TenantPublicPage({ params }: { params: { tenantSlug: string } }) {
  const data = await getPublicCaseBySlug(params.tenantSlug);
  if (!data) notFound();

  const { caseMatter: cm, comments, juryTotals, features } = data;
  const session = await getServerSession(authOptions);

  let initialVote: "FOR_PLAINTIFF" | "FOR_DEFENDANT" | "UNDECIDED" | null = null;
  if (session?.user?.id) {
    const v = await prisma.juryVote.findUnique({
      where: { caseMatterId_userId: { caseMatterId: cm.id, userId: session.user.id } },
    });
    initialVote = v?.position ?? null;
  }

  const timelineRows: TimelineRow[] = cm.timelineItems.map((i) => ({
    id: i.id,
    eventDate: i.eventDate.toISOString(),
    title: i.title,
    shortSummary: i.shortSummary,
    fullDescription: i.fullDescription,
    category: i.category,
    videoUrl: i.videoUrl,
  }));

  const nav = [
    { href: "#summary", label: "Summary" },
    { href: "#parties", label: "Parties" },
    { href: "#documents", label: "Documents" },
    { href: "#timeline", label: "Timeline" },
    { href: "#evidence", label: "Evidence" },
    { href: "#comments", label: "Comments" },
    { href: "#jury", label: "Public Jury" },
  ];

  return (
    <>
      <PageViewTracker tenantSlug={params.tenantSlug} />
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur dark:border-neutral-800 dark:bg-black/90 dark:text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">{cm.category}</p>
            <h1 className="text-lg font-bold leading-tight">{cm.title}</h1>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-neutral-600 dark:text-neutral-400">
              <span>Views: {cm.totalViews}</span>
              <span>Registered users: {cm.registeredUserCount}</span>
              <span>Jury votes: {juryTotals.FOR_PLAINTIFF + juryTotals.FOR_DEFENDANT + juryTotals.UNDECIDED}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <nav className="hidden flex-wrap gap-2 lg:flex">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="rounded-sm px-2 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-white"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
            {session ? (
              <span className="text-xs text-neutral-500 dark:text-neutral-400">{session.user?.email}</span>
            ) : (
              <>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/t/${params.tenantSlug}/login`}>Login</Link>
                </Button>
                <Button asChild size="sm" variant="destructive">
                  <Link href={`/t/${params.tenantSlug}/register`}>Register</Link>
                </Button>
              </>
            )}
            <Button asChild variant="outline" size="sm">
              <Link href="#comments">Submit Comment</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-12 px-4 py-10">
        {cm.heroStatement && (
          <p className="rounded-sm border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-100">{cm.heroStatement}</p>
        )}

        <section id="summary" className="scroll-mt-28 space-y-4">
          <h2 className="text-xl font-semibold">Case Summary</h2>
          <SummaryParagraphs text={cm.caseSummary} className="text-neutral-800 dark:text-neutral-200" />
          <p className="text-xs text-neutral-500">This summary is edited in the tenant admin console and delivered through the same database read path as the public API.</p>
        </section>

        <PlatformDisclaimer />

        <section id="parties" className="scroll-mt-28 space-y-4">
          <h2 className="text-xl font-semibold">Parties</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {cm.parties.map((p) => (
              <Card key={p.id}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Badge variant={p.role === "PLAINTIFF" ? "success" : p.role === "DEFENDANT" ? "danger" : "outline"}>{p.role.replace("_", " ")}</Badge>
                    <CardTitle className="text-base">{p.name}</CardTitle>
                  </div>
                </CardHeader>
                {p.description && (
                  <CardContent>
                    <SummaryParagraphs text={p.description} className="text-sm text-neutral-700 dark:text-neutral-300" />
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
          <dl className="grid gap-2 text-sm text-neutral-700 dark:text-neutral-300 md:grid-cols-2">
            <div>
              <dt className="font-semibold text-black dark:text-white">Jurisdiction</dt>
              <dd>{cm.jurisdiction || "—"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-black dark:text-white">Court or forum</dt>
              <dd>{cm.courtOrForum || "—"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-black dark:text-white">Matter number</dt>
              <dd>{cm.matterNumber || "—"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-black dark:text-white">Status</dt>
              <dd>{cm.statusLabel || "—"}</dd>
            </div>
          </dl>
          {cm.counselNotes && (
            <div>
              <h3 className="text-sm font-semibold">Counsel</h3>
              <SummaryParagraphs text={cm.counselNotes} className="mt-2 text-sm text-neutral-700 dark:text-neutral-300" />
            </div>
          )}
        </section>

        <section id="documents" className="scroll-mt-28 space-y-4">
          <h2 className="text-xl font-semibold">Documents</h2>
          <div className="space-y-3">
            {cm.documents.map((d) => (
              <Card key={d.id}>
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-base">{d.title}</CardTitle>
                    <p className="mt-1 text-xs text-neutral-500">
                      {d.documentDate?.toLocaleDateString()} · {d.filingType} · Views: {d.viewCount}
                    </p>
                  </div>
                  <Badge variant="outline">{d.visibility}</Badge>
                </CardHeader>
                {d.description && (
                  <CardContent className="text-sm text-neutral-700 dark:text-neutral-300">
                    <SummaryParagraphs text={d.description} />
                  </CardContent>
                )}
                <CardContent className="space-y-3 pt-0 text-xs text-neutral-600 dark:text-neutral-400">
                  {d.fileAsset ? (
                    <>
                      <p>
                        File: {d.fileAsset.mimeType}
                        {d.fileAsset.mimeType !== "application/pdf" && (
                          <>
                            {" "}
                            ·{" "}
                            <a
                              className="font-medium text-red-700 underline dark:text-red-400"
                              href={`/api/tenants/${params.tenantSlug}/documents/${d.id}/file`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Open / download
                            </a>
                          </>
                        )}
                      </p>
                      {d.fileAsset.mimeType === "application/pdf" ? (
                        <iframe
                          title={d.title}
                          className="h-[70vh] max-h-[720px] min-h-[320px] w-full rounded-sm border border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900"
                          src={`/api/tenants/${params.tenantSlug}/documents/${d.id}/file`}
                        />
                      ) : null}
                    </>
                  ) : (
                    <p>No file attached (metadata only).</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <CaseTimelineClient tenantSlug={params.tenantSlug} items={timelineRows} />

        <section id="evidence" className="scroll-mt-28 space-y-4">
          <h2 className="text-xl font-semibold">Evidence Library</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {cm.evidenceItems.map((e) => (
              <Card key={e.id}>
                <CardHeader>
                  <CardTitle className="text-base">{e.title}</CardTitle>
                  <p className="text-xs text-neutral-500">
                    {e.exhibitLabel && `Exhibit ${e.exhibitLabel} · `}
                    {e.evidenceType}
                  </p>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                  {e.description && <SummaryParagraphs text={e.description} />}
                  {e.evidenceText && <SummaryParagraphs text={e.evidenceText} />}
                  {e.chainOfCustodyNotes && <p className="text-xs text-neutral-500">Chain of custody: {e.chainOfCustodyNotes}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <CommentSection
          tenantSlug={params.tenantSlug}
          canComment={features.commentManagement}
          comments={comments.map((c) => ({
            id: c.id,
            body: c.body,
            createdAt: c.createdAt.toISOString(),
            user: { name: c.user.name, email: c.user.email },
          }))}
        />

        <JurySection
          tenantSlug={params.tenantSlug}
          enabled={cm.publicJuryEnabled}
          showTotals={features.showVotes}
          totals={juryTotals}
          initialVote={initialVote}
        />
      </main>
    </>
  );
}
