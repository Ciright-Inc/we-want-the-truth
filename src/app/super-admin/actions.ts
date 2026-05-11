"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSuperAdminSession } from "@/lib/super-admin-auth";
import { prisma } from "@/lib/prisma";

export type SaResult = { ok: true } | { ok: false; error: string };

const abuseSchema = z.object({ id: z.string(), status: z.string().min(1).max(64) });
const legalSchema = z.object({ id: z.string(), status: z.string().min(1).max(64) });
const settingSchema = z.object({ key: z.string().min(1).max(200), valueJson: z.string().min(1).max(50_000) });

export async function updateAbuseReportAction(raw: unknown): Promise<SaResult> {
  const s = await getSuperAdminSession();
  if (!s) return { ok: false, error: "Unauthorized" };
  const p = abuseSchema.safeParse(raw);
  if (!p.success) return { ok: false, error: "Invalid" };
  await prisma.abuseReport.update({ where: { id: p.data.id }, data: { status: p.data.status } });
  revalidatePath("/super-admin/content");
  return { ok: true };
}

export async function updateLegalNoticeAction(raw: unknown): Promise<SaResult> {
  const s = await getSuperAdminSession();
  if (!s) return { ok: false, error: "Unauthorized" };
  const p = legalSchema.safeParse(raw);
  if (!p.success) return { ok: false, error: "Invalid" };
  await prisma.legalNotice.update({
    where: { id: p.data.id },
    data: {
      status: p.data.status,
      processedAt: p.data.status === "closed" ? new Date() : null,
    },
  });
  revalidatePath("/super-admin/content");
  return { ok: true };
}

export async function upsertSystemSettingAction(raw: unknown): Promise<SaResult> {
  const s = await getSuperAdminSession();
  if (!s) return { ok: false, error: "Unauthorized" };
  const p = settingSchema.safeParse(raw);
  if (!p.success) return { ok: false, error: "Invalid" };
  let value: unknown;
  try {
    value = JSON.parse(p.data.valueJson) as unknown;
  } catch {
    return { ok: false, error: "Invalid JSON" };
  }
  await prisma.systemSetting.upsert({
    where: { key: p.data.key },
    create: { key: p.data.key, value: value as object },
    update: { value: value as object },
  });
  revalidatePath("/super-admin/settings");
  return { ok: true };
}
