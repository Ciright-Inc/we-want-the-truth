import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function getSuperAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "SUPER_ADMIN") return null;
  return session;
}
