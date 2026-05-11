/**
 * Edge-safe hostname → tenant slug (mirrors TenantDomain in DB; sync in production).
 */
export function parseTenantHostMap(): Record<string, string> {
  const raw = process.env.TENANT_HOST_MAP || "{}";
  try {
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

export function resolveTenantFromHost(host: string): { slug: string; isAdmin: boolean } | null {
  const h = host.split(":")[0]?.toLowerCase() ?? "";
  const map = parseTenantHostMap();

  if (isSuperAdminHost(h)) {
    return null;
  }

  if (h.startsWith("admin.")) {
    const apex = h.slice("admin.".length);
    const slug = map[apex];
    if (slug) return { slug, isAdmin: true };
    return null;
  }

  let slug = map[h];
  if (slug) return { slug, isAdmin: false };
  if (h.startsWith("www.")) {
    slug = map[h.slice(4)];
    if (slug) return { slug, isAdmin: false };
  }
  return null;
}

export function isMarketingHost(host: string): boolean {
  const h = host.split(":")[0]?.toLowerCase() ?? "";
  const list = (process.env.MARKETING_HOSTS || "localhost,we-want-the-truth.com,www.we-want-the-truth.com")
    .split(",")
    .map((s) => s.trim().toLowerCase());
  return list.includes(h);
}

export function isSuperAdminHost(host: string): boolean {
  const h = host.split(":")[0]?.toLowerCase() ?? "";
  const list = (process.env.SUPER_ADMIN_HOSTS || "admin.we-want-the-truth.com,localhost")
    .split(",")
    .map((s) => s.trim().toLowerCase());
  return list.includes(h);
}
