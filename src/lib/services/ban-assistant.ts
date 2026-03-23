import { RankBand } from "@prisma/client";

import { prisma } from "@/lib/db";
import type { BanAssistantInput, BanRecommendation, Playstyle } from "@/lib/types";
import { readFallbackBans, readStringArray } from "@/lib/utils";

const playstyleAttackBoosts: Record<Playstyle, string[]> = {
  SAFE: ["ying", "dokkaebi"],
  BALANCED: ["jackal"],
  AGGRESSIVE: ["jackal", "nomad", "dokkaebi"],
};

const playstyleDefenseBoosts: Record<Playstyle, string[]> = {
  SAFE: ["mira", "kaid", "azami"],
  BALANCED: ["azami", "mira"],
  AGGRESSIVE: ["azami", "fenrir", "mira"],
};

function bumpScore(scores: Map<string, number>, slug: string, amount: number) {
  scores.set(slug, (scores.get(slug) ?? 0) + amount);
}

function lowerScore(scores: Map<string, number>, slug: string, amount: number) {
  scores.set(slug, (scores.get(slug) ?? 0) - amount);
}

function chooseBan(
  scores: Map<string, number>,
  fallbacks: string[],
  comfortSet: Set<string>,
  minimumCandidates = 3,
) {
  const seededCandidates = new Set<string>(fallbacks);

  while (seededCandidates.size < minimumCandidates) {
    const next = [...scores.keys()].find((slug) => !seededCandidates.has(slug));
    if (!next) {
      break;
    }

    seededCandidates.add(next);
  }

  const ordered = [...new Set([...scores.keys(), ...seededCandidates])]
    .filter((slug) => !comfortSet.has(slug))
    .sort((left, right) => (scores.get(right) ?? 0) - (scores.get(left) ?? 0));

  return {
    primary: ordered[0] ?? fallbacks[0] ?? "",
    fallbacks: ordered.slice(1, 3),
  };
}

type PreFetchedData = {
  map: {
    slug: string;
    name: string;
    banRules: {
      id: string;
      rankBand: RankBand;
      attackBan: string;
      defenseBan: string;
      rationale: string;
      fallbackBans: unknown;
      weight: number;
    }[];
  };
  operators: {
    slug: string;
    name: string;
    roleTags: unknown;
  }[];
};

export async function getBanRecommendation(
  input: BanAssistantInput,
  preFetched?: PreFetchedData,
): Promise<BanRecommendation | null> {
  let map: PreFetchedData["map"] | null;
  let operators: PreFetchedData["operators"];

  if (preFetched) {
    map = preFetched.map;
    operators = preFetched.operators;
  } else {
    map = await prisma.map.findUnique({
      where: {
        slug: input.mapSlug,
      },
      include: {
        banRules: true,
      },
    });

    if (!map) {
      return null;
    }

    operators = await prisma.operator.findMany({
      where: {
        active: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  if (!map) {
    return null;
  }

  const operatorNameBySlug = new Map(
    operators.map((operator) => [operator.slug, operator.name]),
  );
  const operatorTagsBySlug = new Map(
    operators.map((operator) => [operator.slug, readStringArray(operator.roleTags)]),
  );

  const rules = [
    map.banRules.find((rule) => rule.rankBand === RankBand.ALL),
    map.banRules.find((rule) => rule.rankBand === input.rankBand),
  ].filter(Boolean);

  const attackScores = new Map<string, number>();
  const defenseScores = new Map<string, number>();
  const adjustments: string[] = [];
  let baseRationale = "Curated default ban guidance for this map.";
  let attackFallbacks: string[] = [];
  let defenseFallbacks: string[] = [];

  for (const rule of rules) {
    if (!rule) {
      continue;
    }

    const fallbackBans = readFallbackBans(rule.fallbackBans);
    attackFallbacks = fallbackBans.attack.length ? fallbackBans.attack : attackFallbacks;
    defenseFallbacks = fallbackBans.defense.length
      ? fallbackBans.defense
      : defenseFallbacks;
    baseRationale = rule.rationale;

    bumpScore(attackScores, rule.attackBan, rule.weight + 20);
    bumpScore(defenseScores, rule.defenseBan, rule.weight + 20);

    fallbackBans.attack.forEach((slug, index) =>
      bumpScore(attackScores, slug, Math.max(rule.weight - index * 8, 12)),
    );
    fallbackBans.defense.forEach((slug, index) =>
      bumpScore(defenseScores, slug, Math.max(rule.weight - index * 8, 12)),
    );
  }

  for (const slug of playstyleAttackBoosts[input.playstyle]) {
    bumpScore(attackScores, slug, 16);
  }

  for (const slug of playstyleDefenseBoosts[input.playstyle]) {
    bumpScore(defenseScores, slug, 16);
  }

  adjustments.push(
    `${
      input.playstyle === "SAFE"
        ? "Safe playstyle"
        : input.playstyle === "AGGRESSIVE"
          ? "Aggressive playstyle"
          : "Balanced playstyle"
    } nudged the shortlist toward utility that disrupts that tempo.`,
  );

  if (input.stackSize <= 2) {
    ["jackal", "dokkaebi"].forEach((slug) => bumpScore(attackScores, slug, 18));
    ["mira", "valkyrie"].forEach((slug) => bumpScore(defenseScores, slug, 14));
    adjustments.push("Small stack size favors bans that reduce info overload and split pressure.");
  } else if (input.stackSize === 5) {
    ["thatcher", "nomad"].forEach((slug) => bumpScore(attackScores, slug, 8));
    ["kaid", "azami"].forEach((slug) => bumpScore(defenseScores, slug, 8));
    adjustments.push("Full-stack coordination lets you target high-value comfort disruptors.");
  }

  const comfortSet = new Set(input.comfortOperators);

  if (comfortSet.size) {
    for (const comfortOperator of comfortSet) {
      lowerScore(attackScores, comfortOperator, 75);
      lowerScore(defenseScores, comfortOperator, 75);
    }

    adjustments.push("Comfort picks were protected so the bans do not eat into your own preferred pool.");
  }

  const comfortTags = new Set(
    [...comfortSet].flatMap((slug) => operatorTagsBySlug.get(slug) ?? []),
  );

  if (!comfortTags.has("hard-breach")) {
    ["kaid", "mute"].forEach((slug) => bumpScore(defenseScores, slug, 18));
    adjustments.push("Your comfort pool is light on hard breach, so breach denial climbed on defense-ban priority.");
  }

  if (!comfortTags.has("flank-watch") && !comfortTags.has("intel")) {
    ["jackal", "dokkaebi", "nomad"].forEach((slug) =>
      bumpScore(attackScores, slug, 16),
    );
    adjustments.push("Limited flank watch and info coverage makes anti-roam attackers more dangerous this game.");
  }

  if (!comfortTags.has("breach-denial") && !comfortTags.has("execute-denial")) {
    ["thatcher", "ying"].forEach((slug) => bumpScore(attackScores, slug, 12));
    adjustments.push("A lighter denial pool means strong execute support is worth trimming from the attacker side.");
  }

  const attackChoice = chooseBan(
    attackScores,
    attackFallbacks,
    comfortSet,
  );
  const defenseChoice = chooseBan(
    defenseScores,
    defenseFallbacks,
    comfortSet,
  );

  const attackBan = attackChoice.primary
    ? operatorNameBySlug.get(attackChoice.primary) ?? attackChoice.primary
    : null;
  const defenseBan = defenseChoice.primary
    ? operatorNameBySlug.get(defenseChoice.primary) ?? defenseChoice.primary
    : null;

  if (!attackBan || !defenseBan) {
    return null;
  }

  return {
    mapName: map.name,
    attackBan,
    defenseBan,
    rationale: `${baseRationale} ${adjustments.slice(0, 3).join(" ")}`.trim(),
    fallbackAttack: attackChoice.fallbacks.map(
      (slug) => operatorNameBySlug.get(slug) ?? slug,
    ),
    fallbackDefense: defenseChoice.fallbacks.map(
      (slug) => operatorNameBySlug.get(slug) ?? slug,
    ),
    adjustments,
    confidence:
      adjustments.length >= 4
        ? "High"
        : adjustments.length >= 2
          ? "Adjusted"
          : "Baseline",
  };
}
