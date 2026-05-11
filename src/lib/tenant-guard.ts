import type { UserRole } from "@prisma/client";

export function assertTenantMatch(sessionTenantId: string | null | undefined, expectedTenantId: string) {
  if (!sessionTenantId || sessionTenantId !== expectedTenantId) {
    throw new Error("Tenant isolation violation");
  }
}

export function canAccessTenantAdmin(role: UserRole | undefined, tenantId: string | null, expectedTenantId: string) {
  if (role === "SUPER_ADMIN") return true;
  if ((role === "TENANT_ADMIN" || role === "TENANT_EDITOR") && tenantId === expectedTenantId) return true;
  return false;
}

export function isSuperAdmin(role: UserRole | undefined) {
  return role === "SUPER_ADMIN";
}
