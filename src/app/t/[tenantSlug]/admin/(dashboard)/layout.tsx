import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TenantAdminMobileNav } from "@/components/admin/tenant-admin-mobile-nav";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { LogoutButton } from "@/components/admin/logout-button";

const links = [
  ["", "Dashboard"],
  ["/case-settings", "Case Settings"],
  ["/documents", "Documents"],
  ["/timeline", "Timeline"],
  ["/evidence", "Evidence"],
  ["/comments", "Comments"],
  ["/video", "Video"],
  ["/jury", "Public Jury"],
  ["/users", "Users"],
  ["/billing", "Billing"],
  ["/domain", "Domain"],
] as const;

export default async function TenantAdminDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { tenantSlug: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect(`/t/${params.tenantSlug}/admin/login?callbackUrl=${encodeURIComponent(`/t/${params.tenantSlug}/admin`)}`);
  }

  const role = session.user.role;
  const isAllowedRole = role === "SUPER_ADMIN" || role === "TENANT_ADMIN" || role === "TENANT_EDITOR";
  if (!isAllowedRole) {
    redirect(`/t/${params.tenantSlug}/admin/login`);
  }
  if (role !== "SUPER_ADMIN" && session.user.tenantSlug !== params.tenantSlug) {
    redirect(`/t/${params.tenantSlug}/admin/login`);
  }

  const tenant = await prisma.tenant.findUnique({ where: { slug: params.tenantSlug } });
  if (!tenant) notFound();

  return (
    <div className="admin-shell min-h-screen bg-neutral-50 text-black dark:bg-neutral-950 dark:text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-56 shrink-0 border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black md:block">
          <div className="p-4 text-sm font-bold">Admin · {params.tenantSlug}</div>
          <nav className="flex flex-col gap-1 px-2 pb-6">
            {links.map(([href, label]) => (
              <Link
                key={href || "dash"}
                href={`/t/${params.tenantSlug}/admin${href}`}
                className="rounded-sm px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900"
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto border-t border-neutral-200 bg-neutral-50/70 px-3 py-3 dark:border-neutral-800 dark:bg-neutral-950">
            <LogoutButton
              callbackUrl={`/t/${params.tenantSlug}/admin/login`}
              userName={session.user.name ?? null}
              userEmail={session.user.email ?? null}
              userImage={session.user.image ?? null}
            />
          </div>
        </aside>
        <div className="flex-1 overflow-auto">
          <TenantAdminMobileNav
            tenantSlug={params.tenantSlug}
            userName={session.user.name ?? null}
            userEmail={session.user.email ?? null}
            userImage={session.user.image ?? null}
          />
          {children}
        </div>
      </div>
    </div>
  );
}
