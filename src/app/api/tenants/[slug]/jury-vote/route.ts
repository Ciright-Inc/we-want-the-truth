import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { hashIp } from "@/lib/utils";

const bodySchema = z.object({
  position: z.enum(["FOR_PLAINTIFF", "FOR_DEFENDANT", "UNDECIDED"]),
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
  if (!tenant?.caseMatter || !tenant.caseMatter.publicJuryEnabled) {
    return NextResponse.json({ error: "Voting disabled" }, { status: 403 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const rl = rateLimit(`vote:${session.user.id}`, 60, 60_000);
  if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  await prisma.juryVote.upsert({
    where: {
      caseMatterId_userId: { caseMatterId: tenant.caseMatter.id, userId: session.user.id },
    },
    create: {
      caseMatterId: tenant.caseMatter.id,
      userId: session.user.id,
      position: parsed.data.position,
      sessionId: req.headers.get("x-session-id"),
      ipHash: hashIp(ip),
    },
    update: {
      position: parsed.data.position,
      ipHash: hashIp(ip),
    },
  });

  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      userId: session.user.id,
      action: "jury_vote",
      resource: tenant.caseMatter.id,
      meta: { position: parsed.data.position },
    },
  });

  return NextResponse.json({ ok: true });
}
