import { LogoutButton } from "@/components/admin/logout-button";
import { SuperAdminMobileNav } from "@/components/admin/super-admin-mobile-nav";
import { SuperAdminSidebarNav } from "@/components/admin/super-admin-sidebar-nav";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { Shield } from "lucide-react";

export default async function SuperAdminConsoleLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <div className="admin-shell h-screen overflow-hidden bg-neutral-100 text-black">
      <div className="flex h-full">
        <aside className="hidden h-full w-72 shrink-0 border-r border-neutral-200 bg-white lg:flex lg:flex-col">
          <div className="border-b border-neutral-200 px-4 py-4">
            <div className="rounded-xl border border-neutral-200 bg-gradient-to-b from-neutral-50 to-white px-3 py-3">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-600">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-red-50 text-red-600 ring-1 ring-red-100">
                  <Shield className="h-3.5 w-3.5" aria-hidden />
                </span>
                Super Admin
              </p>
            </div>
          </div>
          <SuperAdminSidebarNav />
          <div className="mt-auto border-t border-neutral-200 bg-neutral-50/70 px-4 py-4">
            <LogoutButton
              userName={session?.user?.name ?? null}
              userEmail={session?.user?.email ?? null}
              userImage={session?.user?.image ?? null}
            />
          </div>
        </aside>
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <SuperAdminMobileNav />
          <div className="min-h-full p-4 sm:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
