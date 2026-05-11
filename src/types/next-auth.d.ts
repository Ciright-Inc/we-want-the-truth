import type { UserRole } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: UserRole;
      tenantId: string | null;
      tenantSlug: string | null;
    };
  }

  interface User {
    role: UserRole;
    tenantId: string | null;
    tenantSlug: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    tenantId: string | null;
    tenantSlug: string | null;
  }
}
