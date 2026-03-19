import { RankBand, SideType } from "@prisma/client";
import { z } from "zod";

const requiredText = z.string().trim().min(1, "Required");

export const prepSelectorSchema = z.object({
  mapSlug: requiredText,
  side: z.enum(["attack", "defense"]),
  siteSlug: requiredText,
  stackSize: z.number().int().min(1).max(5),
  comfortOperators: z.array(z.string()),
});

export const banAssistantSchema = z.object({
  mapSlug: requiredText,
  rankBand: z.nativeEnum(RankBand),
  playstyle: z.enum(["SAFE", "BALANCED", "AGGRESSIVE"]),
  stackSize: z.number().int().min(1).max(5),
  comfortOperators: z.array(z.string()),
});

export const squadSchema = z.object({
  id: z.string().optional(),
  name: requiredText,
});

export const squadMemberSchema = z.object({
  id: z.string().optional(),
  squadId: requiredText,
  userId: z.string().optional(),
  nickname: requiredText,
  preferredRolesText: z.string().default(""),
  comfortOperatorsText: z.string().default(""),
});

export const savedNoteSchema = z.object({
  id: z.string().optional(),
  squadId: z.string().optional(),
  mapId: requiredText,
  siteId: requiredText,
  title: requiredText,
  body: requiredText,
});

export const playbookCardSchema = z.object({
  id: z.string().optional(),
  squadId: requiredText,
  mapId: requiredText,
  siteId: requiredText,
  title: requiredText,
  summary: requiredText,
  preferredCompText: z.string().default(""),
  assignedRolesText: z.string().default("[]"),
  checklistText: z.string().default(""),
});

export const mapSchema = z.object({
  id: z.string().optional(),
  slug: requiredText,
  name: requiredText,
  seasonTag: requiredText,
  imageUrl: z.string().trim().optional().or(z.literal("")),
  inRotation: z.boolean(),
});

export const siteSchema = z.object({
  id: z.string().optional(),
  mapId: requiredText,
  slug: requiredText,
  name: requiredText,
  sideType: z.nativeEnum(SideType),
  difficulty: z.enum(["LOW", "MEDIUM", "HIGH"]),
});

export const operatorSchema = z.object({
  id: z.string().optional(),
  slug: requiredText,
  name: requiredText,
  side: z.enum(["ATTACK", "DEFENSE"]),
  roleTagsText: z.string().default(""),
  difficulty: z.enum(["LOW", "MEDIUM", "HIGH"]),
  active: z.boolean(),
});

export const strategySchema = z.object({
  id: z.string().optional(),
  mapId: requiredText,
  siteId: requiredText,
  side: z.enum(["ATTACK", "DEFENSE"]),
  title: requiredText,
  description: requiredText,
  planType: z.enum(["SAFE", "AGGRESSIVE", "FALLBACK"]),
  teamSize: z.coerce.number().int().min(1).max(5),
  recommendedOperatorsText: z.string().default(""),
  roleAssignmentsText: requiredText,
  watchoutsText: z.string().default(""),
  setupStepsText: z.string().default(""),
  executionStepsText: z.string().default(""),
  contingencyStepsText: z.string().default(""),
});

export const banRuleSchema = z.object({
  id: z.string().optional(),
  mapId: requiredText,
  rankBand: z.nativeEnum(RankBand),
  attackBan: requiredText,
  defenseBan: requiredText,
  rationale: requiredText,
  fallbackAttackText: z.string().default(""),
  fallbackDefenseText: z.string().default(""),
  weight: z.coerce.number().int().min(0).max(999),
});

export const patchNoteSchema = z.object({
  id: z.string().optional(),
  seasonTag: requiredText,
  title: requiredText,
  summary: requiredText,
  tacticalImplication: requiredText,
  publishedAt: requiredText,
});

export const mapRotationSchema = z.object({
  id: z.string().optional(),
  seasonTag: requiredText,
  effectiveDate: requiredText,
  addedMapsText: z.string().default(""),
  removedMapsText: z.string().default(""),
  notes: requiredText,
});

export type PrepSelectorInput = z.infer<typeof prepSelectorSchema>;
export type BanAssistantFormInput = z.infer<typeof banAssistantSchema>;
