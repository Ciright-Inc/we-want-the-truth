import type { AddOnType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function tenantHasAddOn(tenantId: string, type: AddOnType): Promise<boolean> {
  const sub = await prisma.subscription.findFirst({
    where: { tenantId, status: { in: ["ACTIVE", "TRIALING"] } },
    include: { addOns: { where: { type, active: true } } },
  });
  return !!sub?.addOns.length;
}

export async function tenantHasAdvancedAdmin(tenantId: string) {
  return tenantHasAddOn(tenantId, "ADVANCED_ADMIN");
}

export async function tenantHasVideo(tenantId: string) {
  return tenantHasAddOn(tenantId, "VIDEO_MANAGEMENT");
}

export async function tenantHasComments(tenantId: string) {
  return tenantHasAddOn(tenantId, "COMMENT_MANAGEMENT");
}
