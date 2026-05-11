import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPresignedPutUrl, isAllowedUploadMime } from "@/lib/s3";
import { canAccessTenantAdmin } from "@/lib/tenant-guard";
import { randomUUID } from "crypto";

const bodySchema = z.object({
  tenantSlug: z.string(),
  fileName: z.string().min(1).max(255),
  contentType: z.string(),
  sizeBytes: z.number().int().positive().max(100 * 1024 * 1024),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  if (!isAllowedUploadMime(parsed.data.contentType)) {
    return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
  }

  const tenant = await prisma.tenant.findUnique({ where: { slug: parsed.data.tenantSlug } });
  if (!tenant) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (!canAccessTenantAdmin(session.user.role, session.user.tenantId, tenant.id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const bucket = process.env.S3_BUCKET;
  if (!bucket) return NextResponse.json({ error: "S3 not configured" }, { status: 501 });

  const key = `tenants/${tenant.id}/${randomUUID()}-${parsed.data.fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const url = await createPresignedPutUrl({
    bucket,
    key,
    contentType: parsed.data.contentType,
  });
  if (!url) return NextResponse.json({ error: "Could not sign URL" }, { status: 500 });

  const asset = await prisma.fileAsset.create({
    data: {
      tenantId: tenant.id,
      bucket,
      key,
      mimeType: parsed.data.contentType,
      sizeBytes: parsed.data.sizeBytes,
      originalName: parsed.data.fileName,
    },
  });

  return NextResponse.json({ uploadUrl: url, fileAssetId: asset.id, key });
}
