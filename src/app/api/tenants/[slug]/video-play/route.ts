import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

const bodySchema = z.object({
  videoId: z.string(),
  timelineItemId: z.string().optional(),
  secondsWatched: z.coerce.number().int().min(0),
  completed: z.boolean(),
  anonymousSession: z.string().optional(),
});

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  const slug = params.slug;
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const tenant = await prisma.tenant.findUnique({ where: { slug } });
  if (!tenant) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  const rl = rateLimit(`vp:${ip}:${slug}`, 300, 60_000);
  if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ?? null;

  await prisma.videoPlayEvent.create({
    data: {
      videoId: parsed.data.videoId,
      timelineItemId: parsed.data.timelineItemId,
      tenantId: tenant.id,
      userId: userId ?? undefined,
      anonymousSession: parsed.data.anonymousSession ?? (!userId ? `anon-${ip.slice(0, 16)}` : undefined),
      secondsWatched: parsed.data.secondsWatched,
      completed: parsed.data.completed,
    },
  });

  return NextResponse.json({ ok: true });
}
