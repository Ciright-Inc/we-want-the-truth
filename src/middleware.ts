import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { resolveTenantFromHost } from "@/lib/tenant-resolve";

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const h = host.split(":")[0]?.toLowerCase() ?? "";
  const url = request.nextUrl.clone();
  const path = url.pathname;

  if (path.startsWith("/api") || path.startsWith("/_next")) {
    return NextResponse.next();
  }

  // Production super-admin hostname → internal /super-admin routes
  if (h === "admin.we-want-the-truth.com") {
    if (!path.startsWith("/super-admin")) {
      url.pathname = path === "/" ? "/super-admin" : `/super-admin${path}`;
      return NextResponse.rewrite(url);
    }
  }

  const tenant = resolveTenantFromHost(host);
  if (tenant && !path.startsWith("/t/")) {
    const base = tenant.isAdmin ? `/t/${tenant.slug}/admin` : `/t/${tenant.slug}`;
    url.pathname = path === "/" ? base : `${base}${path}`;
    return NextResponse.rewrite(url);
  }

  if (path.startsWith("/super-admin/login")) {
    return NextResponse.next();
  }

  if (path.startsWith("/super-admin")) {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) return NextResponse.next();
    const token = await getToken({ req: request, secret });
    if (!token || token.role !== "SUPER_ADMIN") {
      url.pathname = "/super-admin/login";
      url.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const adminMatch = path.match(/^\/t\/([^/]+)\/admin(\/.*)?$/);
  if (adminMatch) {
    const slug = adminMatch[1];
    const isLogin = path.endsWith("/admin/login");
    if (isLogin) return NextResponse.next();

    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) return NextResponse.next();
    const token = await getToken({ req: request, secret });
    if (!token) {
      url.pathname = `/t/${slug}/admin/login`;
      url.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(url);
    }
    if (token.role !== "SUPER_ADMIN" && token.role !== "TENANT_ADMIN" && token.role !== "TENANT_EDITOR") {
      return new NextResponse("Forbidden", { status: 403 });
    }
    if (token.role !== "SUPER_ADMIN") {
      if (token.tenantSlug !== slug) {
        return new NextResponse("Forbidden", { status: 403 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
