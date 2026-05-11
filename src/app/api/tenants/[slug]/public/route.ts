import { NextResponse } from "next/server";
import { getPublicCaseBySlug } from "@/lib/get-public-case";

/** Public read model for QA / integrations (same source as the public page). */
export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const data = await getPublicCaseBySlug(params.slug);
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { caseMatter, tenant, comments, juryTotals, features } = data;
  return NextResponse.json({
    tenant: { id: tenant.id, slug: tenant.slug, name: tenant.name },
    case: {
      title: caseMatter.title,
      caseSummary: caseMatter.caseSummary,
      category: caseMatter.category,
      totalViews: caseMatter.totalViews,
    },
    comments: comments.map((c) => ({ id: c.id, body: c.body, status: c.status })),
    juryTotals,
    features,
  });
}
