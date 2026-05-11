import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  // Placeholder: store truncated hash in production use crypto.subtle or server-only hash
  return `h:${ip.slice(0, 8)}`;
}
