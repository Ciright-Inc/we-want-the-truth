import { describe, expect, it } from "vitest";
import { assertTenantMatch, canAccessTenantAdmin, isSuperAdmin } from "@/lib/tenant-guard";

describe("tenant-guard", () => {
  it("assertTenantMatch throws on mismatch", () => {
    expect(() => assertTenantMatch("a", "b")).toThrow("Tenant isolation violation");
    expect(() => assertTenantMatch("a", "a")).not.toThrow();
  });

  it("canAccessTenantAdmin respects roles", () => {
    expect(canAccessTenantAdmin("SUPER_ADMIN", null, "any")).toBe(true);
    expect(canAccessTenantAdmin("TENANT_ADMIN", "t1", "t1")).toBe(true);
    expect(canAccessTenantAdmin("TENANT_EDITOR", "t1", "t1")).toBe(true);
    expect(canAccessTenantAdmin("TENANT_ADMIN", "t1", "t2")).toBe(false);
    expect(canAccessTenantAdmin("PUBLIC_USER", "t1", "t1")).toBe(false);
  });

  it("isSuperAdmin", () => {
    expect(isSuperAdmin("SUPER_ADMIN")).toBe(true);
    expect(isSuperAdmin("PUBLIC_USER")).toBe(false);
  });
});
