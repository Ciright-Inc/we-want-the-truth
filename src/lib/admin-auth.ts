import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccessTenantAdmin } from "@/lib/tenant-guard";

export async function getTenantAdminContext(tenantSlug: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
    include: {
      caseMatter: {
        include: { parties: { orderBy: { sortOrder: "asc" } } },
      },
    },
  });

  if (!tenant?.caseMatter) return null;
  if (!canAccessTenantAdmin(session.user.role, session.user.tenantId, tenant.id)) {
    return null;
  }

  return { session, tenant, caseMatter: tenant.caseMatter };
}
