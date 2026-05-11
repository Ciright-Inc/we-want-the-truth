"use server";

import { revalidatePath } from "next/cache";
import type { UserRole } from "@prisma/client";
import { getTenantAdminContext } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { auditLog } from "@/lib/audit";
import {
  bulkCommentSchema,
  caseSettingsSchema,
  commentModerationSchema,
  documentInputSchema,
  evidenceInputSchema,
  timelineInputSchema,
  userRoleUpdateSchema,
} from "@/lib/validators/admin";

export type ActionResult = { ok: true; message?: string } | { ok: false; error: string };

function tagsFromString(s: string | null | undefined): string[] {
  if (!s?.trim()) return [];
  return s
    .split(/[,;\n]+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 40);
}

function imageUrlsFromText(s: string | null | undefined): string[] {
  if (!s?.trim()) return [];
  return s
    .split(/\n+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 20);
}

function rev(tenantSlug: string) {
  revalidatePath(`/t/${tenantSlug}`);
  revalidatePath(`/t/${tenantSlug}/admin`);
  revalidatePath(`/t/${tenantSlug}/admin`, "layout");
}

export async function saveCaseSettingsAction(tenantSlug: string, raw: unknown): Promise<ActionResult> {
  const ctx = await getTenantAdminContext(tenantSlug);
  if (!ctx) return { ok: false, error: "Unauthorized" };
  const parsed = caseSettingsSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.flatten().formErrors.join("; ") };

  const cm = ctx.caseMatter;
  const { parties, ...rest } = parsed.data;

  await prisma.$transaction(async (tx) => {
    await tx.party.deleteMany({ where: { caseMatterId: cm.id } });
    await tx.party.createMany({
      data: parties.map((p, idx) => ({
        caseMatterId: cm.id,
        role: p.role,
        name: p.name,
        description: p.description ?? null,
        sortOrder: p.sortOrder ?? idx,
      })),
    });
    await tx.caseMatter.update({
      where: { id: cm.id },
      data: {
        title: rest.title,
        caseSummary: rest.caseSummary,
        heroStatement: rest.heroStatement ?? null,
        category: rest.category ?? null,
        jurisdiction: rest.jurisdiction ?? null,
        courtOrForum: rest.courtOrForum ?? null,
        matterNumber: rest.matterNumber ?? null,
        statusLabel: rest.statusLabel ?? null,
        logoUrl: rest.logoUrl ?? null,
        themePreference: rest.themePreference,
        isPublicCase: rest.isPublicCase,
        allowAnonymousBrowsing: rest.allowAnonymousBrowsing,
        publicJuryEnabled: rest.publicJuryEnabled,
        showAggregateVotes: rest.showAggregateVotes,
        commentModerationDefault: rest.commentModerationDefault,
        plaintiffLabel: rest.plaintiffLabel ?? null,
        defendantLabel: rest.defendantLabel ?? null,
        counselNotes: rest.counselNotes ?? null,
      },
    });
  });

  await auditLog({
    tenantId: ctx.tenant.id,
    userId: ctx.session.user.id,
    action: "case_settings_update",
    resource: cm.id,
  });
  rev(tenantSlug);
  return { ok: true, message: "Case settings saved." };
}

export async function saveDocumentAction(tenantSlug: string, raw: unknown): Promise<ActionResult> {
  const ctx = await getTenantAdminContext(tenantSlug);
  if (!ctx) return { ok: false, error: "Unauthorized" };
  const parsed = documentInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Invalid document" };

  const cm = ctx.caseMatter;
  const d = parsed.data;
  const docDate = d.documentDate ? new Date(d.documentDate) : null;
  const tags = tagsFromString(d.tags);

  if (d.id) {
    const existing = await prisma.document.findFirst({
      where: { id: d.id, caseMatterId: cm.id, deletedAt: null },
    });
    if (!existing) return { ok: false, error: "Document not found" };
    if (d.fileAssetId) {
      const fa = await prisma.fileAsset.findFirst({ where: { id: d.fileAssetId, tenantId: ctx.tenant.id } });
      if (!fa) return { ok: false, error: "Invalid file asset" };
    }
    await prisma.document.update({
      where: { id: d.id },
      data: {
        title: d.title,
        documentDate: docDate,
        filingType: d.filingType ?? null,
        description: d.description ?? null,
        source: d.source ?? null,
        visibility: d.visibility,
        tags,
        fileAssetId: d.fileAssetId === null ? null : d.fileAssetId ?? undefined,
      },
    });
  } else {
    if (d.fileAssetId) {
      const fa = await prisma.fileAsset.findFirst({ where: { id: d.fileAssetId, tenantId: ctx.tenant.id } });
      if (!fa) return { ok: false, error: "Invalid file asset" };
    }
    await prisma.document.create({
      data: {
        caseMatterId: cm.id,
        title: d.title,
        documentDate: docDate,
        filingType: d.filingType ?? null,
        description: d.description ?? null,
        source: d.source ?? null,
        visibility: d.visibility,
        tags,
        fileAssetId: d.fileAssetId ?? null,
      },
    });
  }

  await auditLog({ tenantId: ctx.tenant.id, userId: ctx.session.user.id, action: "document_upsert", resource: d.id });
  rev(tenantSlug);
  return { ok: true, message: "Document saved." };
}

export async function deleteDocumentAction(tenantSlug: string, documentId: string): Promise<ActionResult> {
  const ctx = await getTenantAdminContext(tenantSlug);
  if (!ctx) return { ok: false, error: "Unauthorized" };
  const doc = await prisma.document.findFirst({
    where: { id: documentId, caseMatterId: ctx.caseMatter.id, deletedAt: null },
  });
  if (!doc) return { ok: false, error: "Not found" };
  await prisma.document.update({ where: { id: documentId }, data: { deletedAt: new Date() } });
  await auditLog({ tenantId: ctx.tenant.id, userId: ctx.session.user.id, action: "document_soft_delete", resource: documentId });
  rev(tenantSlug);
  return { ok: true };
}

export async function saveTimelineAction(tenantSlug: string, raw: unknown): Promise<ActionResult> {
  const ctx = await getTenantAdminContext(tenantSlug);
  if (!ctx) return { ok: false, error: "Unauthorized" };
  const parsed = timelineInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Invalid timeline item" };

  const cm = ctx.caseMatter;
  const t = parsed.data;
  const eventDate = new Date(t.eventDate);
  const imageUrls = imageUrlsFromText(t.imageUrlsText);

  const data = {
    eventDate,
    title: t.title,
    shortSummary: t.shortSummary ?? null,
    fullDescription: t.fullDescription,
    category: t.category ?? null,
    visibility: t.visibility,
    featured: t.featured,
    videoUrl: t.videoUrl ?? null,
    audioFileUrl: t.audioFileUrl ?? null,
    imageUrls,
  };

  if (t.id) {
    const ex = await prisma.timelineItem.findFirst({ where: { id: t.id, caseMatterId: cm.id, deletedAt: null } });
    if (!ex) return { ok: false, error: "Not found" };
    await prisma.timelineItem.update({ where: { id: t.id }, data });
  } else {
    await prisma.timelineItem.create({ data: { ...data, caseMatterId: cm.id } });
  }
  await auditLog({ tenantId: ctx.tenant.id, userId: ctx.session.user.id, action: "timeline_upsert", resource: t.id });
  rev(tenantSlug);
  return { ok: true, message: "Timeline saved." };
}

export async function deleteTimelineAction(tenantSlug: string, timelineId: string): Promise<ActionResult> {
  const ctx = await getTenantAdminContext(tenantSlug);
  if (!ctx) return { ok: false, error: "Unauthorized" };
  const ex = await prisma.timelineItem.findFirst({
    where: { id: timelineId, caseMatterId: ctx.caseMatter.id, deletedAt: null },
  });
  if (!ex) return { ok: false, error: "Not found" };
  await prisma.timelineItem.update({ where: { id: timelineId }, data: { deletedAt: new Date() } });
  rev(tenantSlug);
  return { ok: true };
}

export async function saveEvidenceAction(tenantSlug: string, raw: unknown): Promise<ActionResult> {
  const ctx = await getTenantAdminContext(tenantSlug);
  if (!ctx) return { ok: false, error: "Unauthorized" };
  const parsed = evidenceInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Invalid evidence" };

  const cm = ctx.caseMatter;
  const e = parsed.data;
  const evidenceDate = e.evidenceDate ? new Date(e.evidenceDate) : null;
  const tags = tagsFromString(e.tags);

  const data = {
    title: e.title,
    exhibitLabel: e.exhibitLabel ?? null,
    evidenceDate,
    description: e.description ?? null,
    evidenceText: e.evidenceText ?? null,
    evidenceType: e.evidenceType,
    chainOfCustodyNotes: e.chainOfCustodyNotes ?? null,
    visibility: e.visibility,
    tags,
  };

  if (e.id) {
    const ex = await prisma.evidenceItem.findFirst({ where: { id: e.id, caseMatterId: cm.id, deletedAt: null } });
    if (!ex) return { ok: false, error: "Not found" };
    await prisma.evidenceItem.update({ where: { id: e.id }, data });
  } else {
    await prisma.evidenceItem.create({ data: { ...data, caseMatterId: cm.id } });
  }
  rev(tenantSlug);
  return { ok: true, message: "Evidence saved." };
}

export async function deleteEvidenceAction(tenantSlug: string, evidenceId: string): Promise<ActionResult> {
  const ctx = await getTenantAdminContext(tenantSlug);
  if (!ctx) return { ok: false, error: "Unauthorized" };
  const ex = await prisma.evidenceItem.findFirst({
    where: { id: evidenceId, caseMatterId: ctx.caseMatter.id, deletedAt: null },
  });
  if (!ex) return { ok: false, error: "Not found" };
  await prisma.evidenceItem.update({ where: { id: evidenceId }, data: { deletedAt: new Date() } });
  rev(tenantSlug);
  return { ok: true };
}

export async function setCommentStatusAction(tenantSlug: string, raw: unknown): Promise<ActionResult> {
  const ctx = await getTenantAdminContext(tenantSlug);
  if (!ctx) return { ok: false, error: "Unauthorized" };
  const parsed = commentModerationSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Invalid" };
  const c = await prisma.comment.findFirst({
    where: { id: parsed.data.commentId, caseMatterId: ctx.caseMatter.id, deletedAt: null },
  });
  if (!c) return { ok: false, error: "Not found" };
  await prisma.comment.update({
    where: { id: c.id },
    data: { status: parsed.data.status },
  });
  rev(tenantSlug);
  return { ok: true };
}

export async function bulkSetCommentStatusAction(tenantSlug: string, raw: unknown): Promise<ActionResult> {
  const ctx = await getTenantAdminContext(tenantSlug);
  if (!ctx) return { ok: false, error: "Unauthorized" };
  const parsed = bulkCommentSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Invalid" };
  await prisma.comment.updateMany({
    where: { id: { in: parsed.data.commentIds }, caseMatterId: ctx.caseMatter.id },
    data: { status: parsed.data.status },
  });
  rev(tenantSlug);
  return { ok: true, message: "Comments updated." };
}

export async function setCommentPinnedAction(tenantSlug: string, commentId: string, pinned: boolean): Promise<ActionResult> {
  const ctx = await getTenantAdminContext(tenantSlug);
  if (!ctx) return { ok: false, error: "Unauthorized" };
  const c = await prisma.comment.findFirst({
    where: { id: commentId, caseMatterId: ctx.caseMatter.id, deletedAt: null },
  });
  if (!c) return { ok: false, error: "Not found" };
  await prisma.comment.update({ where: { id: commentId }, data: { pinned } });
  rev(tenantSlug);
  return { ok: true };
}

export async function updateJurySettingsAction(
  tenantSlug: string,
  input: { publicJuryEnabled: boolean; showAggregateVotes: boolean }
): Promise<ActionResult> {
  const ctx = await getTenantAdminContext(tenantSlug);
  if (!ctx) return { ok: false, error: "Unauthorized" };
  await prisma.caseMatter.update({
    where: { id: ctx.caseMatter.id },
    data: {
      publicJuryEnabled: input.publicJuryEnabled,
      showAggregateVotes: input.showAggregateVotes,
    },
  });
  rev(tenantSlug);
  return { ok: true, message: "Jury settings updated." };
}

export async function updateTenantUserAction(tenantSlug: string, raw: unknown): Promise<ActionResult> {
  const ctx = await getTenantAdminContext(tenantSlug);
  if (!ctx) return { ok: false, error: "Unauthorized" };
  const parsed = userRoleUpdateSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Invalid" };

  const u = await prisma.user.findFirst({
    where: { id: parsed.data.userId, tenantId: ctx.tenant.id },
  });
  if (!u) return { ok: false, error: "User not in tenant" };
  if (u.role === "TENANT_ADMIN" && parsed.data.role !== "TENANT_ADMIN") {
    const adminCount = await prisma.user.count({
      where: { tenantId: ctx.tenant.id, role: "TENANT_ADMIN", disabled: false },
    });
    if (adminCount <= 1) return { ok: false, error: "Cannot remove the last tenant admin." };
  }

  await prisma.user.update({
    where: { id: u.id },
    data: { role: parsed.data.role as UserRole, disabled: parsed.data.disabled },
  });
  rev(tenantSlug);
  return { ok: true, message: "User updated." };
}

export async function exportJuryVotesCsvAction(tenantSlug: string): Promise<ActionResult & { csv?: string }> {
  const ctx = await getTenantAdminContext(tenantSlug);
  if (!ctx) return { ok: false, error: "Unauthorized" };
  const votes = await prisma.juryVote.findMany({
    where: { caseMatterId: ctx.caseMatter.id },
    include: { user: { select: { email: true, id: true } } },
  });
  const header = "user_id,email,position,updated_at";
  const lines = votes.map((v) => `${v.userId},${JSON.stringify(v.user.email)},${v.position},${v.updatedAt.toISOString()}`);
  const csv = [header, ...lines].join("\n");
  return { ok: true, csv };
}

export async function createTenantEditorAction(tenantSlug: string, email: string, password: string): Promise<ActionResult> {
  const ctx = await getTenantAdminContext(tenantSlug);
  if (!ctx) return { ok: false, error: "Unauthorized" };
  if (password.length < 10) return { ok: false, error: "Password min 10 chars" };
  const bcrypt = await import("bcryptjs");
  const normalized = email.toLowerCase().trim();
  const exists = await prisma.user.findUnique({ where: { email: normalized } });
  if (exists) return { ok: false, error: "Email already registered globally." };
  await prisma.user.create({
    data: {
      email: normalized,
      passwordHash: await bcrypt.hash(password, 12),
      role: "TENANT_EDITOR",
      tenantId: ctx.tenant.id,
      termsAcceptedAt: new Date(),
    },
  });
  rev(tenantSlug);
  return { ok: true, message: "Editor account created." };
}

export async function createVideoAssetAction(tenantSlug: string, title: string, embedUrl: string): Promise<ActionResult> {
  const ctx = await getTenantAdminContext(tenantSlug);
  if (!ctx) return { ok: false, error: "Unauthorized" };
  const t = title.trim();
  if (!t) return { ok: false, error: "Title required" };
  await prisma.videoAsset.create({
    data: {
      tenantId: ctx.tenant.id,
      caseMatterId: ctx.caseMatter.id,
      title: t,
      embedUrl: embedUrl.trim() || null,
    },
  });
  await auditLog({ tenantId: ctx.tenant.id, userId: ctx.session.user.id, action: "video_asset_create" });
  rev(tenantSlug);
  return { ok: true, message: "Video record created." };
}
