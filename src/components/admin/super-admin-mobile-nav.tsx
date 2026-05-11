"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { LogOut, Menu, Shield, X } from "lucide-react";

const links = [
  ["", "Overview"],
  ["/tenants", "Tenants"],
  ["/domains", "Domains"],
  ["/stripe", "Billing"],
  ["/analytics", "Analytics"],
  ["/users", "Users"],
  ["/content", "Content"],
  ["/settings", "Settings"],
] as const;

export function SuperAdminMobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const userName = session?.user?.name?.trim() || "Signed in user";
  const userEmail = session?.user?.email?.trim() || "Super admin";
  const userImage = session?.user?.image;
  const initials =
    userName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() ?? "")
      .join("") || "U";

  return (
    <div className="border-b border-neutral-200 bg-white px-3 py-2 lg:hidden">
      <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-700">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-red-50 text-red-600">
            <Shield className="h-3.5 w-3.5" aria-hidden />
          </span>
          Super Admin
        </p>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-700"
        >
          {open ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
        </button>
      </div>

      {open ? (
        <nav className="mt-2 grid gap-1 rounded-lg border border-neutral-200 bg-white p-2">
          {links.map(([href, label]) => {
            const fullHref = `/super-admin${href}`;
            const active = href === "" ? pathname === "/super-admin" : pathname?.startsWith(fullHref);
            return (
              <Link
                key={href || "overview"}
                href={fullHref}
                onClick={() => setOpen(false)}
                className={[
                  "rounded-md px-3 py-2 text-sm font-semibold",
                  active ? "bg-red-50 text-red-700" : "text-neutral-700 hover:bg-neutral-50",
                ].join(" ")}
              >
                {label}
              </Link>
            );
          })}
          <div className="mt-1 rounded-md border border-neutral-200 bg-neutral-50 p-2.5">
            <div className="flex items-center gap-2.5">
              {userImage ? (
                <img src={userImage} alt={userName} className="h-8 w-8 rounded-full border border-neutral-200 object-cover" />
              ) : (
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-[11px] font-semibold text-neutral-700">
                  {initials}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-neutral-900">{userName}</p>
                <p className="truncate text-[11px] text-neutral-500">{userEmail}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/super-admin/login" })}
              className="mt-2 inline-flex w-full items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              Logout
            </button>
          </div>
        </nav>
      ) : null}
    </div>
  );
}
