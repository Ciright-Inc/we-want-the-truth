import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type CirightEmployee = {
  employeeId?: number | string;
  name?: string;
  employeePhoto?: string;
  email?: string;
  isManagementEmployee?: number | string;
};

type CirightLoginResponse = {
  status?: boolean | string;
  message?: string;
  data?: Array<{
    employees?: CirightEmployee[];
  }>;
};

function asBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true" || value === "1";
  if (typeof value === "number") return value === 1;
  return false;
}

function resolveCirightSettings(tenantSlug: string) {
  const url = process.env.CIRIGHT_LOGIN_URL?.trim() || "https://myciright.com/Ciright/api/commonrestapi/m1342055";
  const subscriptionId = Number(process.env.CIRIGHT_SUBSCRIPTION_ID ?? "9329");
  const verticalId = Number(process.env.CIRIGHT_VERTICAL_ID ?? "18");
  const appId = Number(process.env.CIRIGHT_APP_ID ?? "2967");
  const sphereTypeUrl = process.env.CIRIGHT_SPHERE_TYPE_URL?.trim() || `${tenantSlug}.htm`;
  return { url, subscriptionId, verticalId, appId, sphereTypeUrl };
}

function resolveCirightSuperAdminSettings() {
  const url = process.env.CIRIGHT_LOGIN_URL?.trim() || "https://myciright.com/Ciright/api/commonrestapi/m1342055";
  const subscriptionId = Number(process.env.CIRIGHT_SUBSCRIPTION_ID ?? "9329");
  const verticalId = Number(process.env.CIRIGHT_VERTICAL_ID ?? "18");
  const appId = Number(process.env.CIRIGHT_APP_ID ?? "2967");
  const sphereTypeUrl = process.env.CIRIGHT_SUPERADMIN_SPHERE_TYPE_URL?.trim() || "we-want-the-truth.htm";
  return { url, subscriptionId, verticalId, appId, sphereTypeUrl };
}

async function authorizeTenantAdminViaCiright(credentials: Record<string, string>, tenantSlug: string) {
  const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
  if (!tenant) return null;

  const { url, subscriptionId, verticalId, appId, sphereTypeUrl } = resolveCirightSettings(tenantSlug);
  const username = credentials.email?.trim();
  const password = credentials.password;

  if (!username || !password || Number.isNaN(subscriptionId) || Number.isNaN(verticalId) || Number.isNaN(appId)) {
    return null;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subscriptionId,
        verticalId,
        username,
        password,
        rememberMe: true,
        appId,
        sphereTypeUrl,
      }),
      cache: "no-store",
    });

    if (!response.ok) return null;
    const payload = (await response.json()) as CirightLoginResponse;
    if (!asBoolean(payload.status)) return null;

    const employee = payload.data?.[0]?.employees?.[0];
    if (!employee) return null;

    const role: UserRole = asBoolean(employee.isManagementEmployee) ? "TENANT_ADMIN" : "TENANT_EDITOR";
    const employeeId = employee.employeeId != null ? String(employee.employeeId) : `tenant-${tenantSlug}-${username}`;

    return {
      id: `ciright-${employeeId}`,
      email: employee.email || username,
      name: employee.name ?? username,
      image: employee.employeePhoto ?? undefined,
      role,
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
    };
  } catch {
    return null;
  }
}

async function authorizeSuperAdminViaCiright(credentials: Record<string, string>) {
  const { url, subscriptionId, verticalId, appId, sphereTypeUrl } = resolveCirightSuperAdminSettings();
  const username = credentials.email?.trim();
  const password = credentials.password;

  if (!username || !password || Number.isNaN(subscriptionId) || Number.isNaN(verticalId) || Number.isNaN(appId)) {
    return null;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subscriptionId,
        verticalId,
        username,
        password,
        rememberMe: true,
        appId,
        sphereTypeUrl,
      }),
      cache: "no-store",
    });

    if (!response.ok) return null;
    const payload = (await response.json()) as CirightLoginResponse;
    if (!asBoolean(payload.status)) return null;

    const employee = payload.data?.[0]?.employees?.[0];
    if (!employee) return null;

    const employeeId = employee.employeeId != null ? String(employee.employeeId) : `super-admin-${username}`;
    return {
      id: `ciright-${employeeId}`,
      email: employee.email || username,
      name: employee.name ?? username,
      image: employee.employeePhoto ?? undefined,
      role: "SUPER_ADMIN" as const,
      tenantId: null,
      tenantSlug: null,
    };
  } catch {
    return null;
  }
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        tenantSlug: { label: "Tenant", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const requestedSlug = credentials.tenantSlug?.trim() || null;

        // Tenant admin login is authenticated against Ciright.
        if (requestedSlug) {
          return authorizeTenantAdminViaCiright(credentials as Record<string, string>, requestedSlug);
        }

        // Super-admin login is authenticated strictly against Ciright (no local DB fallback).
        return authorizeSuperAdminViaCiright(credentials as Record<string, string>);
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.tenantId = user.tenantId ?? null;
        token.tenantSlug = user.tenantSlug ?? null;
      }
      if (trigger === "update" && session?.tenantSlug) {
        token.tenantSlug = session.tenantSlug as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role;
        session.user.tenantId = token.tenantId ?? null;
        session.user.tenantSlug = token.tenantSlug ?? null;
      }
      return session;
    },
  },
};
