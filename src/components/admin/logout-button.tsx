"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

type LogoutButtonProps = {
  callbackUrl?: string;
  userName?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
};

function getInitials(value: string) {
  const words = value.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "U";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

export function LogoutButton({ callbackUrl = "/super-admin/login", userName, userEmail, userImage }: LogoutButtonProps) {
  const displayName = userName?.trim() || "Signed in user";
  const subtitle = userEmail?.trim() || "Super admin";

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-neutral-200 bg-white px-3 py-2.5">
        <div className="flex items-center gap-3">
          {userImage ? (
            <img src={userImage} alt={displayName} className="h-10 w-10 rounded-full border border-neutral-200 object-cover" />
          ) : (
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 text-xs font-semibold text-neutral-700">
              {getInitials(displayName)}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-neutral-900">{displayName}</p>
            <p className="truncate text-xs text-neutral-500">{subtitle}</p>
          </div>
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        className="h-12 w-full justify-start rounded-xl border-neutral-300 bg-white text-base font-semibold text-neutral-800 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:bg-neutral-100"
        onClick={() => signOut({ callbackUrl })}
      >
        <LogOut className="mr-2 h-4 w-4" aria-hidden />
        Logout
      </Button>
    </div>
  );
}
