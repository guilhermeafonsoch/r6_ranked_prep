import { Difficulty, PlanType, RankBand, Side } from "@prisma/client";

import type { Playstyle } from "@/lib/types";

export const sideOptions = [
  { value: "attack", label: "Attack" },
  { value: "defense", label: "Defense" },
] as const;

export const sideToEnum: Record<(typeof sideOptions)[number]["value"], Side> = {
  attack: Side.ATTACK,
  defense: Side.DEFENSE,
};

export const enumToSideRoute: Record<Side, (typeof sideOptions)[number]["value"]> =
  {
    ATTACK: "attack",
    DEFENSE: "defense",
  };

export const rankBandOptions = [
  { value: RankBand.COPPER_BRONZE, label: "Copper to Bronze" },
  { value: RankBand.SILVER_GOLD, label: "Silver to Gold" },
  { value: RankBand.PLATINUM_EMERALD, label: "Platinum to Emerald" },
  { value: RankBand.DIAMOND_CHAMPION, label: "Diamond to Champion" },
] as const;

export const playstyleOptions: { value: Playstyle; label: string }[] = [
  { value: "SAFE", label: "Safe" },
  { value: "BALANCED", label: "Balanced" },
  { value: "AGGRESSIVE", label: "Aggressive" },
];

export const stackSizeOptions = [1, 2, 3, 4, 5];

export const difficultyLabels: Record<Difficulty, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

export const planTypeLabels: Record<PlanType, string> = {
  SAFE: "Safe Plan",
  AGGRESSIVE: "Aggressive Plan",
  FALLBACK: "Fallback Plan",
};

export const adminSections = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/maps", label: "Maps" },
  { href: "/admin/sites", label: "Sites" },
  { href: "/admin/operators", label: "Operators" },
  { href: "/admin/strategies", label: "Strategies" },
  { href: "/admin/bans", label: "Ban Rules" },
  { href: "/admin/patches", label: "Patches" },
];

export const defaultSeasonTag = "Y11S1 Demo";
