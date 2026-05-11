import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function TenantShellLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { tenantSlug: string };
}) {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: params.tenantSlug },
    include: { caseMatter: true },
  });
  if (!tenant) notFound();
  const isDark = tenant.caseMatter?.themePreference === "dark";

  return (
    <div className={isDark ? "dark min-h-screen bg-black text-white" : "min-h-screen bg-white text-black"}>{children}</div>
  );
}
