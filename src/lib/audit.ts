import { prisma } from "@/lib/prisma";

export async function auditLog(input: {
  tenantId?: string | null;
  userId?: string | null;
  action: string;
  resource?: string;
  meta?: Record<string, unknown>;
}) {
  await prisma.auditLog.create({
    data: {
      tenantId: input.tenantId ?? undefined,
      userId: input.userId ?? undefined,
      action: input.action,
      resource: input.resource,
      meta: input.meta as object | undefined,
    },
  });
}
