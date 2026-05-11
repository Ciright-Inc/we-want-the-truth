"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Building2, Globe, LayoutDashboard, Settings2, ShieldCheck, SlidersHorizontal, Users } from "lucide-react";

const links = [
  ["", "Overview", LayoutDashboard],
  ["/tenants", "Tenants", Building2],
  ["/domains", "Domains", Globe],
  ["/stripe", "Stripe / Billing", SlidersHorizontal],
  ["/analytics", "Visitors / Analytics", Activity],
  ["/users", "Users", Users],
  ["/content", "Content Oversight", ShieldCheck],
  ["/settings", "Product Settings", Settings2],
] as const;

export function SuperAdminSidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
      <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">Navigation</p>
      {links.map(([href, label, Icon]) => {
        const fullHref = `/super-admin${href}`;
        const active = href === "" ? pathname === "/super-admin" : pathname?.startsWith(fullHref);

        return (
          <Link
            key={href || "ov"}
            href={fullHref}
            className={[
              "block rounded-lg border border-transparent px-3 py-2.5 text-[14px] font-semibold leading-tight transition-all",
              active
                ? "border-red-200 bg-red-50 text-red-700 shadow-[inset_0_0_0_1px_rgba(239,68,68,0.1)]"
                : "text-neutral-700 hover:border-neutral-200 hover:bg-neutral-50 hover:text-neutral-900",
            ].join(" ")}
          >
            <span className="inline-flex items-center gap-2.5">
              <Icon className={["h-4 w-4", active ? "text-red-600" : "text-neutral-500"].join(" ")} aria-hidden />
              <span>{label}</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
