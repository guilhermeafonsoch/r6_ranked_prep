"use server";

import { revalidatePath } from "next/cache";
import { Phase } from "@prisma/client";

import { prisma } from "@/lib/db";
import { isAdminEnabled } from "@/lib/demo-auth";
import {
  banRuleSchema,
  mapRotationSchema,
  mapSchema,
  operatorSchema,
  patchNoteSchema,
  siteSchema,
  strategySchema,
} from "@/lib/validation/forms";
import {
  checkboxValue,
  parseCsv,
  parseJsonText,
  parseLines,
} from "@/lib/utils";

function ensureAdminEnabled() {
  if (!isAdminEnabled()) {
    throw new Error("Admin mode is disabled.");
  }
}

function revalidateAdminPath(path: string) {
  revalidatePath("/admin");
  revalidatePath(path);
  revalidatePath("/");
  revalidatePath("/prep");
  revalidatePath("/bans");
  revalidatePath("/patches");
  revalidatePath("/playbook");
}

export async function saveMapAction(formData: FormData) {
  ensureAdminEnabled();

  const parsed = mapSchema.parse({
    id: (formData.get("id") as string) || undefined,
    slug: formData.get("slug"),
    name: formData.get("name"),
    seasonTag: formData.get("seasonTag"),
    imageUrl: (formData.get("imageUrl") as string) || "",
    inRotation: checkboxValue(formData.get("inRotation")),
  });

  const data = {
    slug: parsed.slug,
    name: parsed.name,
    seasonTag: parsed.seasonTag,
    imageUrl: parsed.imageUrl || null,
    inRotation: parsed.inRotation,
  };

  if (parsed.id) {
    await prisma.map.update({ where: { id: parsed.id }, data });
  } else {
    await prisma.map.create({ data });
  }

  revalidateAdminPath("/admin/maps");
}

export async function deleteMapAction(formData: FormData) {
  ensureAdminEnabled();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    throw new Error("Map id is required.");
  }

  await prisma.map.delete({ where: { id } });
  revalidateAdminPath("/admin/maps");
}

export async function saveSiteAction(formData: FormData) {
  ensureAdminEnabled();

  const parsed = siteSchema.parse({
    id: (formData.get("id") as string) || undefined,
    mapId: formData.get("mapId"),
    slug: formData.get("slug"),
    name: formData.get("name"),
    sideType: formData.get("sideType"),
    difficulty: formData.get("difficulty"),
  });

  const data = {
    mapId: parsed.mapId,
    slug: parsed.slug,
    name: parsed.name,
    sideType: parsed.sideType,
    difficulty: parsed.difficulty,
  };

  if (parsed.id) {
    await prisma.site.update({ where: { id: parsed.id }, data });
  } else {
    await prisma.site.create({ data });
  }

  revalidateAdminPath("/admin/sites");
}

export async function deleteSiteAction(formData: FormData) {
  ensureAdminEnabled();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    throw new Error("Site id is required.");
  }

  await prisma.site.delete({ where: { id } });
  revalidateAdminPath("/admin/sites");
}

export async function saveOperatorAction(formData: FormData) {
  ensureAdminEnabled();

  const parsed = operatorSchema.parse({
    id: (formData.get("id") as string) || undefined,
    slug: formData.get("slug"),
    name: formData.get("name"),
    side: formData.get("side"),
    roleTagsText: formData.get("roleTagsText"),
    difficulty: formData.get("difficulty"),
    active: checkboxValue(formData.get("active")),
  });

  const data = {
    slug: parsed.slug,
    name: parsed.name,
    side: parsed.side,
    roleTags: parseCsv(parsed.roleTagsText),
    difficulty: parsed.difficulty,
    active: parsed.active,
  };

  if (parsed.id) {
    await prisma.operator.update({ where: { id: parsed.id }, data });
  } else {
    await prisma.operator.create({ data });
  }

  revalidateAdminPath("/admin/operators");
}

export async function deleteOperatorAction(formData: FormData) {
  ensureAdminEnabled();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    throw new Error("Operator id is required.");
  }

  await prisma.operator.delete({ where: { id } });
  revalidateAdminPath("/admin/operators");
}

export async function saveStrategyAction(formData: FormData) {
  ensureAdminEnabled();

  const parsed = strategySchema.parse({
    id: (formData.get("id") as string) || undefined,
    mapId: formData.get("mapId"),
    siteId: formData.get("siteId"),
    side: formData.get("side"),
    title: formData.get("title"),
    description: formData.get("description"),
    planType: formData.get("planType"),
    teamSize: formData.get("teamSize"),
    recommendedOperatorsText: formData.get("recommendedOperatorsText"),
    roleAssignmentsText: formData.get("roleAssignmentsText"),
    watchoutsText: formData.get("watchoutsText"),
    setupStepsText: formData.get("setupStepsText"),
    executionStepsText: formData.get("executionStepsText"),
    contingencyStepsText: formData.get("contingencyStepsText"),
  });

  const data = {
    mapId: parsed.mapId,
    siteId: parsed.siteId,
    side: parsed.side,
    title: parsed.title,
    description: parsed.description,
    planType: parsed.planType,
    teamSize: parsed.teamSize,
    recommendedOperators: parseCsv(parsed.recommendedOperatorsText),
    roleAssignments: parseJsonText(parsed.roleAssignmentsText, []),
    watchouts: parseLines(parsed.watchoutsText),
  };

  const steps = [
    ...parseLines(parsed.setupStepsText).map((text, index) => ({
      phase: Phase.SETUP,
      stepOrder: index + 1,
      text,
    })),
    ...parseLines(parsed.executionStepsText).map((text, index) => ({
      phase: Phase.EXECUTION,
      stepOrder: index + 1,
      text,
    })),
    ...parseLines(parsed.contingencyStepsText).map((text, index) => ({
      phase: Phase.CONTINGENCY,
      stepOrder: index + 1,
      text,
    })),
  ];

  if (parsed.id) {
    const strategyId = parsed.id;
    await prisma.$transaction(async (tx) => {
      await tx.strategyCard.update({
        where: { id: strategyId },
        data,
      });

      await tx.strategyStep.deleteMany({
        where: { strategyCardId: strategyId },
      });

      if (steps.length) {
        await tx.strategyStep.createMany({
          data: steps.map((step) => ({
            ...step,
            strategyCardId: strategyId,
          })),
        });
      }
    });
  } else {
    await prisma.strategyCard.create({
      data: {
        ...data,
        steps: {
          create: steps,
        },
      },
    });
  }

  revalidateAdminPath("/admin/strategies");
}

export async function deleteStrategyAction(formData: FormData) {
  ensureAdminEnabled();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    throw new Error("Strategy card id is required.");
  }

  await prisma.strategyCard.delete({ where: { id } });
  revalidateAdminPath("/admin/strategies");
}

export async function saveBanRuleAction(formData: FormData) {
  ensureAdminEnabled();

  const parsed = banRuleSchema.parse({
    id: (formData.get("id") as string) || undefined,
    mapId: formData.get("mapId"),
    rankBand: formData.get("rankBand"),
    attackBan: formData.get("attackBan"),
    defenseBan: formData.get("defenseBan"),
    rationale: formData.get("rationale"),
    fallbackAttackText: formData.get("fallbackAttackText"),
    fallbackDefenseText: formData.get("fallbackDefenseText"),
    weight: formData.get("weight"),
  });

  const data = {
    mapId: parsed.mapId,
    rankBand: parsed.rankBand,
    attackBan: parsed.attackBan,
    defenseBan: parsed.defenseBan,
    rationale: parsed.rationale,
    fallbackBans: {
      attack: parseCsv(parsed.fallbackAttackText),
      defense: parseCsv(parsed.fallbackDefenseText),
    },
    weight: parsed.weight,
  };

  if (parsed.id) {
    await prisma.banRule.update({ where: { id: parsed.id }, data });
  } else {
    await prisma.banRule.create({ data });
  }

  revalidateAdminPath("/admin/bans");
}

export async function deleteBanRuleAction(formData: FormData) {
  ensureAdminEnabled();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    throw new Error("Ban rule id is required.");
  }

  await prisma.banRule.delete({ where: { id } });
  revalidateAdminPath("/admin/bans");
}

export async function savePatchNoteAction(formData: FormData) {
  ensureAdminEnabled();

  const parsed = patchNoteSchema.parse({
    id: (formData.get("id") as string) || undefined,
    seasonTag: formData.get("seasonTag"),
    title: formData.get("title"),
    summary: formData.get("summary"),
    tacticalImplication: formData.get("tacticalImplication"),
    publishedAt: formData.get("publishedAt"),
  });

  const data = {
    seasonTag: parsed.seasonTag,
    title: parsed.title,
    summary: parsed.summary,
    tacticalImplication: parsed.tacticalImplication,
    publishedAt: new Date(parsed.publishedAt),
  };

  if (parsed.id) {
    await prisma.patchNote.update({ where: { id: parsed.id }, data });
  } else {
    await prisma.patchNote.create({ data });
  }

  revalidateAdminPath("/admin/patches");
}

export async function deletePatchNoteAction(formData: FormData) {
  ensureAdminEnabled();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    throw new Error("Patch note id is required.");
  }

  await prisma.patchNote.delete({ where: { id } });
  revalidateAdminPath("/admin/patches");
}

export async function saveRotationEventAction(formData: FormData) {
  ensureAdminEnabled();

  const parsed = mapRotationSchema.parse({
    id: (formData.get("id") as string) || undefined,
    seasonTag: formData.get("seasonTag"),
    effectiveDate: formData.get("effectiveDate"),
    addedMapsText: formData.get("addedMapsText"),
    removedMapsText: formData.get("removedMapsText"),
    notes: formData.get("notes"),
  });

  const data = {
    seasonTag: parsed.seasonTag,
    effectiveDate: new Date(parsed.effectiveDate),
    addedMaps: parseCsv(parsed.addedMapsText),
    removedMaps: parseCsv(parsed.removedMapsText),
    notes: parsed.notes,
  };

  if (parsed.id) {
    await prisma.mapRotationEvent.update({ where: { id: parsed.id }, data });
  } else {
    await prisma.mapRotationEvent.create({ data });
  }

  revalidateAdminPath("/admin/patches");
}

export async function deleteRotationEventAction(formData: FormData) {
  ensureAdminEnabled();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    throw new Error("Rotation event id is required.");
  }

  await prisma.mapRotationEvent.delete({ where: { id } });
  revalidateAdminPath("/admin/patches");
}
