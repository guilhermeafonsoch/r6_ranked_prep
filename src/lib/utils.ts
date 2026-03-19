import { type ClassValue, clsx } from "clsx";
import { Difficulty, RankBand, Side } from "@prisma/client";
import { twMerge } from "tailwind-merge";

import type { FallbackBans, PlaybookRoleAssignment, RoleAssignment } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseCsv(value: string | null | undefined) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseLines(value: string | null | undefined) {
  return (value ?? "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function formatRankBand(rankBand: RankBand) {
  return (
    {
      COPPER_BRONZE: "Copper to Bronze",
      SILVER_GOLD: "Silver to Gold",
      PLATINUM_EMERALD: "Platinum to Emerald",
      DIAMOND_CHAMPION: "Diamond to Champion",
      ALL: "All ranked bands",
    } satisfies Record<RankBand, string>
  )[rankBand];
}

export function formatSide(side: Side | "attack" | "defense") {
  if (side === Side.ATTACK || side === "attack") {
    return "Attack";
  }

  return "Defense";
}

export function formatDifficulty(difficulty: Difficulty) {
  return (
    {
      LOW: "Low",
      MEDIUM: "Medium",
      HIGH: "High",
    } satisfies Record<Difficulty, string>
  )[difficulty];
}

export function safeJsonParse<T>(value: string, fallback: T) {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function readStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

export function readFallbackBans(value: unknown): FallbackBans {
  if (!value || typeof value !== "object") {
    return { attack: [], defense: [] };
  }

  const record = value as Record<string, unknown>;

  return {
    attack: readStringArray(record.attack),
    defense: readStringArray(record.defense),
  };
}

export function readRoleAssignments(value: unknown): RoleAssignment[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!item || typeof item !== "object") {
      return [];
    }

    const record = item as Record<string, unknown>;

    if (
      typeof record.slot !== "string" ||
      typeof record.role !== "string" ||
      typeof record.operator !== "string" ||
      typeof record.responsibility !== "string" ||
      typeof record.minStackSize !== "number"
    ) {
      return [];
    }

    return [
      {
        slot: record.slot,
        role: record.role,
        operator: record.operator,
        responsibility: record.responsibility,
        minStackSize: record.minStackSize,
        tags: readStringArray(record.tags),
      },
    ];
  });
}

export function readPlaybookAssignments(value: unknown): PlaybookRoleAssignment[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!item || typeof item !== "object") {
      return [];
    }

    const record = item as Record<string, unknown>;

    if (typeof record.player !== "string" || typeof record.role !== "string") {
      return [];
    }

    return [
      {
        player: record.player,
        role: record.role,
        operator: typeof record.operator === "string" ? record.operator : undefined,
        note: typeof record.note === "string" ? record.note : undefined,
      },
    ];
  });
}

export function checkboxValue(value: FormDataEntryValue | null) {
  return value === "on" || value === "true";
}

export function parseJsonText<T>(value: string, fallback: T) {
  return safeJsonParse<T>(value.trim(), fallback);
}

export function sortByPublishedDateDesc<T extends { publishedAt: Date }>(items: T[]) {
  return [...items].sort(
    (left, right) => right.publishedAt.getTime() - left.publishedAt.getTime(),
  );
}
