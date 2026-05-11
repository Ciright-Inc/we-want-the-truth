import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TenantAdminMobileNav } from "@/components/admin/tenant-admin-mobile-nav";

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
        </aside>
        <div className="flex-1 overflow-auto">
          <TenantAdminMobileNav tenantSlug={params.tenantSlug} />
          {children}
        </div>
      </div>
    </div>
  );
}
