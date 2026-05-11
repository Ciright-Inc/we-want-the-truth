import { z } from "zod";
import { CommentStatus, FileVisibility, PartyRole } from "@prisma/client";

export const caseSettingsSchema = z.object({
  title: z.string().min(1).max(500),
  caseSummary: z.string().min(1).max(100_000),
  heroStatement: z.string().max(20_000).optional().nullable(),
  category: z.string().max(200).optional().nullable(),
  jurisdiction: z.string().max(500).optional().nullable(),
  courtOrForum: z.string().max(500).optional().nullable(),
  matterNumber: z.string().max(200).optional().nullable(),
  statusLabel: z.string().max(200).optional().nullable(),
  logoUrl: z.string().max(2000).optional().nullable(),
  themePreference: z.enum(["dark", "light"]),
  isPublicCase: z.boolean(),
  allowAnonymousBrowsing: z.boolean(),
  publicJuryEnabled: z.boolean(),
  showAggregateVotes: z.boolean(),
  commentModerationDefault: z.boolean(),
  plaintiffLabel: z.string().max(200).optional().nullable(),
  defendantLabel: z.string().max(200).optional().nullable(),
  counselNotes: z.string().max(20_000).optional().nullable(),
  parties: z
    .array(
      z.object({
        id: z.string().optional(),
        role: z.nativeEnum(PartyRole),
        name: z.string().min(1).max(500),
        description: z.string().max(10_000).optional().nullable(),
        sortOrder: z.number().int().min(0).max(100),
      })
    )
    .min(1)
    .max(30),
});

export const documentInputSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1).max(500),
  documentDate: z.string().optional().nullable(),
  filingType: z.string().max(200).optional().nullable(),
  description: z.string().max(20_000).optional().nullable(),
  source: z.string().max(500).optional().nullable(),
  visibility: z.nativeEnum(FileVisibility),
  tags: z.string().max(2000).optional().nullable(),
  fileAssetId: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v === "" ? null : v)),
});

export const timelineInputSchema = z.object({
  id: z.string().optional(),
  eventDate: z.string().min(1),
  title: z.string().min(1).max(500),
  shortSummary: z.string().max(20_000).optional().nullable(),
  fullDescription: z.string().min(1).max(100_000),
  category: z.string().max(200).optional().nullable(),
  visibility: z.nativeEnum(FileVisibility),
  featured: z.boolean(),
  videoUrl: z.string().max(2000).optional().nullable(),
  audioFileUrl: z.string().max(2000).optional().nullable(),
  imageUrlsText: z.string().max(5000).optional().nullable(),
});

export const evidenceInputSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1).max(500),
  exhibitLabel: z.string().max(100).optional().nullable(),
  evidenceDate: z.string().optional().nullable(),
  description: z.string().max(20_000).optional().nullable(),
  evidenceText: z.string().max(100_000).optional().nullable(),
  evidenceType: z.string().min(1).max(120),
  chainOfCustodyNotes: z.string().max(20_000).optional().nullable(),
  visibility: z.nativeEnum(FileVisibility),
  tags: z.string().max(2000).optional().nullable(),
});

export const commentModerationSchema = z.object({
  commentId: z.string(),
  status: z.nativeEnum(CommentStatus),
});

export const bulkCommentSchema = z.object({
  commentIds: z.array(z.string()).min(1).max(200),
  status: z.nativeEnum(CommentStatus),
});

export const userRoleUpdateSchema = z.object({
  userId: z.string(),
  role: z.enum(["PUBLIC_USER", "TENANT_EDITOR", "TENANT_ADMIN"]),
  disabled: z.boolean(),
});
