import { NextResponse } from "next/server";
import { z } from "zod";
import { checkDomainAvailability } from "@/lib/domain-provision";

const q = z.object({ domain: z.string().min(3).max(253) });

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = q.safeParse({ domain: url.searchParams.get("domain") || "" });
  if (!parsed.success) return NextResponse.json({ error: "Invalid domain" }, { status: 400 });
  const result = await checkDomainAvailability(parsed.data.domain);
  return NextResponse.json(result);
}
