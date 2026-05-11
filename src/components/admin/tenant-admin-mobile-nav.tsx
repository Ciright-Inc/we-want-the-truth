"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  ["", "Dashboard"],
  ["/case-settings", "Case Settings"],
  ["/documents", "Documents"],
  ["/timeline", "Timeline"],
  ["/evidence", "Evidence"],
  ["/comments", "Comments"],
  ["/video", "Video"],
  ["/jury", "Jury"],
  ["/users", "Users"],
  ["/billing", "Billing"],
  ["/domain", "Domain"],
] as const;

export function TenantAdminMobileNav({ tenantSlug }: { tenantSlug: string }) {
  const pathname = usePathname();

  return (
    <nav className="overflow-x-auto border-b border-neutral-200 bg-white px-3 py-2 md:hidden">
      <div className="flex min-w-max items-center gap-2">
        {links.map(([href, label]) => {
          const fullHref = `/t/${tenantSlug}/admin${href}`;
          const active = href === "" ? pathname === `/t/${tenantSlug}/admin` : pathname?.startsWith(fullHref);
          return (
            <Link
              key={href || "dash"}
              href={fullHref}
              className={[
                "rounded-md border px-3 py-1.5 text-xs font-semibold",
                active ? "border-red-200 bg-red-50 text-red-700" : "border-neutral-200 bg-white text-neutral-700",
              ].join(" ")}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
