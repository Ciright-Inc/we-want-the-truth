import { prisma } from "@/lib/prisma";
import { ShieldCheck, Sparkles, UserCircle2, UserX } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SuperAdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { id: true, email: true, role: true, tenantId: true, disabled: true },
  });
  const disabledUsers = users.filter((u) => u.disabled).length;
  const activeUsers = users.length - disabledUsers;
  const superAdmins = users.filter((u) => u.role === "SUPER_ADMIN").length;

  const roleStyle: Record<string, string> = {
    SUPER_ADMIN: "bg-purple-100 text-purple-700",
    TENANT_ADMIN: "bg-blue-100 text-blue-700",
    TENANT_EDITOR: "bg-cyan-100 text-cyan-700",
    PUBLIC_USER: "bg-neutral-100 text-neutral-700",
  };

  return (
    <div className="h-full w-full">
      <div className="flex min-h-[calc(100vh-3rem)] flex-col rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-600">Identity management</p>
            <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">Users</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600">
              Directory of platform users across all tenant workspaces and operator-level accounts.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-neutral-600">
            <Sparkles className="h-3.5 w-3.5 text-red-500" aria-hidden />
            Showing latest {users.length} users
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:mt-6 sm:gap-4 sm:grid-cols-3">
          <article className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Active users</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-2xl font-semibold tracking-tight text-neutral-900">{activeUsers}</p>
              <UserCircle2 className="h-5 w-5 text-red-500" aria-hidden />
            </div>
          </article>
          <article className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Disabled users</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-2xl font-semibold tracking-tight text-neutral-900">{disabledUsers}</p>
              <UserX className="h-5 w-5 text-amber-600" aria-hidden />
            </div>
          </article>
          <article className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Super admins</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-2xl font-semibold tracking-tight text-neutral-900">{superAdmins}</p>
              <ShieldCheck className="h-5 w-5 text-purple-600" aria-hidden />
            </div>
          </article>
        </div>

        <div className="mt-5 overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:mt-6">
          <table className="min-w-[820px] text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-600">
            <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Tenant</th>
                <th className="px-4 py-3">Disabled</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-neutral-100 align-top last:border-b-0">
                <td className="px-4 py-3.5 text-neutral-900">{u.email}</td>
                <td className="px-4 py-3.5">
                  <span
                    className={[
                      "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                      roleStyle[u.role] ?? "bg-neutral-100 text-neutral-700",
                    ].join(" ")}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  {u.tenantId ? (
                    <span className="inline-flex rounded-md bg-neutral-100 px-2 py-1 font-mono text-xs text-neutral-700">{u.tenantId}</span>
                  ) : (
                    <span className="text-xs text-neutral-500">—</span>
                  )}
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={[
                      "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                      u.disabled ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700",
                    ].join(" ")}
                  >
                    {u.disabled ? "yes" : "no"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
