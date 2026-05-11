import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPresignedGetUrl } from "@/lib/s3";
import { canAccessTenantAdmin } from "@/lib/tenant-guard";
import { FileVisibility } from "@prisma/client";

export async function GET(_req: Request, { params }: { params: { slug: string; docId: string } }) {
  const doc = await prisma.document.findFirst({
    where: { id: params.docId, deletedAt: null },
    include: {
      fileAsset: true,
      caseMatter: { include: { tenant: true } },
    },
  });

  if (!doc?.fileAsset || doc.caseMatter.tenant.slug !== params.slug) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isPublicDoc = doc.visibility === FileVisibility.PUBLIC && doc.caseMatter.isPublicCase;
  let allowed = isPublicDoc;

  if (!allowed) {
    const session = await getServerSession(authOptions);
    const tenant = doc.caseMatter.tenant;
    if (session?.user && canAccessTenantAdmin(session.user.role, session.user.tenantId, tenant.id)) {
      allowed = true;
    }
  }

  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = await createPresignedGetUrl({
    bucket: doc.fileAsset.bucket,
    key: doc.fileAsset.key,
    expiresSeconds: 3600,
  });

  if (!url) {
    return NextResponse.json({ error: "File storage not configured" }, { status: 503 });
  }

  return NextResponse.redirect(url);
}
