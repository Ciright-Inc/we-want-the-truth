import Link from "next/link";

const links = [
  ["", "Overview"],
  ["/tenants", "Tenants"],
  ["/domains", "Domains"],
  ["/stripe", "Stripe / Billing"],
  ["/analytics", "Visitors / Analytics"],
  ["/users", "Users"],
  ["/content", "Content Oversight"],
  ["/settings", "Product Settings"],
] as const;

export default function SuperAdminConsoleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-100 text-black">
      <div className="flex min-h-screen">
        <aside className="hidden w-52 shrink-0 border-r border-neutral-200 bg-white lg:block">
          <div className="p-4 text-xs font-bold uppercase tracking-wide text-neutral-500">Super Admin</div>
          <nav className="flex flex-col gap-1 px-2 pb-8">
            {links.map(([href, label]) => (
              <Link key={href || "ov"} href={`/super-admin${href}`} className="rounded-sm px-3 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-100">
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
