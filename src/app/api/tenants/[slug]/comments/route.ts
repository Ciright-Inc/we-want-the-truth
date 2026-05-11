import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { tenantHasComments } from "@/lib/addons";
import { rateLimit } from "@/lib/rate-limit";

const bodySchema = z.object({
  body: z.string().min(3).max(8000),
  relatedDocumentId: z.string().optional(),
  relatedTimelineId: z.string().optional(),
  relatedEvidenceId: z.string().optional(),
});

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const slug = params.slug;
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const tenant = await prisma.tenant.findUnique({
    where: { slug },
    include: { caseMatter: true },
  });
  if (!tenant?.caseMatter) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const hasAddon = await tenantHasComments(tenant.id);
  if (!hasAddon) {
    return NextResponse.json({ error: "Comment management add-on is not active for this case." }, { status: 403 });
  }

  const rl = rateLimit(`comment:${session.user.id}`, 30, 3600_000);
  if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const cm = tenant.caseMatter;
  const status = cm.commentModerationDefault ? "PENDING" : "APPROVED";

  await prisma.comment.create({
    data: {
      caseMatterId: cm.id,
      userId: session.user.id,
      body: parsed.data.body,
      relatedDocumentId: parsed.data.relatedDocumentId,
      relatedTimelineId: parsed.data.relatedTimelineId,
      relatedEvidenceId: parsed.data.relatedEvidenceId,
      status,
    },
  });

  return NextResponse.json({ ok: true, status });
}
