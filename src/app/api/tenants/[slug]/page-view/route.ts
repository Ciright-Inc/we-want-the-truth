import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(_req: Request, { params }: { params: { slug: string } }) {
  const slug = params.slug;
  const rl = rateLimit(`pv:${slug}`, 120, 60_000);
  if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const tenant = await prisma.tenant.findUnique({
    where: { slug },
    include: { caseMatter: true },
  });
  if (!tenant?.caseMatter) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.$transaction([
    prisma.caseMatter.update({
      where: { id: tenant.caseMatter.id },
      data: { totalViews: { increment: 1 } },
    }),
    prisma.pageView.create({
      data: { tenantId: tenant.id, path: "/" },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
