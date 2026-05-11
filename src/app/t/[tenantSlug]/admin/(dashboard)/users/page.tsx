import { notFound } from "next/navigation";
import { getTenantAdminContext } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { UsersAdminPanel } from "@/components/admin/users-admin-panel";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({ params }: { params: { tenantSlug: string } }) {
  const ctx = await getTenantAdminContext(params.tenantSlug);
  if (!ctx) notFound();

  const users = await prisma.user.findMany({
    where: { tenantId: ctx.tenant.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, name: true, role: true, disabled: true },
  });

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-2xl font-bold">Users</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Tenant-scoped directory. Promote editors, adjust roles, and disable abusive accounts.</p>
      <div className="mt-8">
        <UsersAdminPanel tenantSlug={params.tenantSlug} users={users} />
      </div>
    </div>
  );
}
