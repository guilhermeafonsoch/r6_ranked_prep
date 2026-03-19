import { RankBand } from "@prisma/client";

export type Playstyle = "SAFE" | "BALANCED" | "AGGRESSIVE";

export type RoleAssignment = {
  slot: string;
  role: string;
  operator: string;
  responsibility: string;
  minStackSize: number;
  tags?: string[];
};

export type FallbackBans = {
  attack: string[];
  defense: string[];
};

export type PlaybookRoleAssignment = {
  player: string;
  role: string;
  operator?: string;
  note?: string;
};

export type BanAssistantInput = {
  mapSlug: string;
  rankBand: RankBand;
  comfortOperators: string[];
  playstyle: Playstyle;
  stackSize: number;
};

export type BanRecommendation = {
  mapName: string;
  attackBan: string;
  defenseBan: string;
  rationale: string;
  fallbackAttack: string[];
  fallbackDefense: string[];
  adjustments: string[];
  confidence: "Baseline" | "Adjusted" | "High";
};

export type RecentPlan = {
  mapSlug: string;
  mapName: string;
  side: "attack" | "defense";
  siteSlug: string;
  siteName: string;
  stackSize: number;
  comfortOperators: string[];
  updatedAt: string;
};
