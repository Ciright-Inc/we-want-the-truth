import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(10),
  name: z.string().min(1).max(120).optional(),
  tenantSlug: z.string().min(2),
  acceptTerms: z.literal(true),
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  const rl = rateLimit(`reg:${ip}`, 10, 3600_000);
  if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const tenant = await prisma.tenant.findUnique({ where: { slug: parsed.data.tenantSlug } });
  if (!tenant) return NextResponse.json({ error: "Case not found" }, { status: 404 });

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await prisma.user.create({
    data: {
      email,
      passwordHash,
      name: parsed.data.name,
      role: "PUBLIC_USER",
      tenantId: tenant.id,
      termsAcceptedAt: new Date(),
    },
  });

  await prisma.caseMatter.update({
    where: { tenantId: tenant.id },
    data: { registeredUserCount: { increment: 1 } },
  });

  return NextResponse.json({ ok: true });
}
