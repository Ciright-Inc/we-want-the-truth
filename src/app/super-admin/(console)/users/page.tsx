import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SuperAdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { id: true, email: true, role: true, tenantId: true, disabled: true },
  });
  return (
    <div className="p-8 lg:p-12">
      <h1 className="text-2xl font-bold">Users</h1>
      <div className="mt-6 overflow-x-auto rounded-sm border border-neutral-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase text-neutral-600">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Tenant</th>
              <th className="px-4 py-3">Disabled</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-neutral-100">
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{u.role}</td>
                <td className="px-4 py-3 text-xs">{u.tenantId ?? "—"}</td>
                <td className="px-4 py-3">{u.disabled ? "yes" : "no"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
