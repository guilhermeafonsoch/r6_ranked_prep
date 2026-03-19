import { RankBand, Side } from "@prisma/client";

import { prisma } from "@/lib/db";
import { getBanRecommendation } from "@/lib/services/ban-assistant";
import type { RoleAssignment } from "@/lib/types";
import {
  readRoleAssignments,
  readStringArray,
} from "@/lib/utils";

type PrepDetailOptions = {
  mapSlug: string;
  siteSlug: string;
  side: Side;
  stackSize: number;
  comfortOperators: string[];
  rankBand: RankBand;
};

export async function getPrepIndexData() {
  return prisma.map.findMany({
    where: {
      inRotation: true,
    },
    include: {
      sites: {
        orderBy: {
          name: "asc",
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function getMapOverviewData(mapSlug: string) {
  return prisma.map.findUnique({
    where: {
      slug: mapSlug,
    },
    include: {
      sites: {
        orderBy: {
          name: "asc",
        },
      },
      banRules: {
        orderBy: {
          rankBand: "asc",
        },
      },
      strategies: {
        include: {
          steps: {
            orderBy: {
              stepOrder: "asc",
            },
          },
        },
      },
    },
  });
}

function collapseAssignmentsForStack(assignments: RoleAssignment[], stackSize: number) {
  const active = assignments.filter((assignment) => assignment.minStackSize <= stackSize);
  const deferred = assignments.filter((assignment) => assignment.minStackSize > stackSize);

  if (!active.length) {
    return [];
  }

  if (!deferred.length) {
    return active;
  }

  return active.map((assignment, index) => {
    if (index !== active.length - 1) {
      return assignment;
    }

    return {
      ...assignment,
      responsibility: `${assignment.responsibility} Also absorb ${deferred
        .map((item) => item.role.toLowerCase())
        .join(" and ")} if the stack stays at ${stackSize}.`,
    };
  });
}

function filterRelevantPatchNotes(
  patchNotes: {
    id: string;
    title: string;
    summary: string;
    tacticalImplication: string;
    seasonTag: string;
    publishedAt: Date;
  }[],
  searchTerms: string[],
) {
  const loweredTerms = searchTerms.map((term) => term.toLowerCase());
  const matched = patchNotes.filter((note) => {
    const haystack = `${note.title} ${note.summary} ${note.tacticalImplication}`.toLowerCase();
    return loweredTerms.some((term) => haystack.includes(term));
  });

  return matched.length ? matched.slice(0, 3) : patchNotes.slice(0, 3);
}

export async function getPrepDetailData(options: PrepDetailOptions) {
  const [map, operators, patchNotes] = await Promise.all([
    prisma.map.findUnique({
      where: {
        slug: options.mapSlug,
      },
      include: {
        sites: true,
      },
    }),
    prisma.operator.findMany({
      where: {
        active: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
    prisma.patchNote.findMany({
      orderBy: {
        publishedAt: "desc",
      },
      take: 6,
    }),
  ]);

  if (!map) {
    return null;
  }

  const site = map.sites.find((entry) => entry.slug === options.siteSlug);

  if (!site) {
    return null;
  }

  const [strategies, notes, squads, banRecommendation] = await Promise.all([
    prisma.strategyCard.findMany({
      where: {
        siteId: site.id,
        side: options.side,
      },
      include: {
        steps: {
          orderBy: {
            stepOrder: "asc",
          },
        },
      },
      orderBy: {
        planType: "asc",
      },
    }),
    prisma.savedNote.findMany({
      where: {
        mapId: map.id,
        siteId: site.id,
      },
      include: {
        squad: true,
        user: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 5,
    }),
    prisma.squad.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      take: 8,
    }),
    getBanRecommendation({
      mapSlug: map.slug,
      rankBand: options.rankBand,
      comfortOperators: options.comfortOperators,
      playstyle: "BALANCED",
      stackSize: options.stackSize,
    }),
  ]);

  const operatorNameBySlug = new Map(
    operators.map((operator) => [operator.slug, operator.name]),
  );

  const hydratedStrategies = strategies.map((strategy) => {
    const recommendedOperators = readStringArray(strategy.recommendedOperators);
    const parsedAssignments = readRoleAssignments(strategy.roleAssignments);
    const watchouts = readStringArray(strategy.watchouts);
    const stepsByPhase = {
      setup: strategy.steps
        .filter((step) => step.phase === "SETUP")
        .map((step) => step.text),
      execution: strategy.steps
        .filter((step) => step.phase === "EXECUTION")
        .map((step) => step.text),
      contingency: strategy.steps
        .filter((step) => step.phase === "CONTINGENCY")
        .map((step) => step.text),
    };

    return {
      ...strategy,
      recommendedOperators,
      recommendedOperatorNames: recommendedOperators.map(
        (slug) => operatorNameBySlug.get(slug) ?? slug,
      ),
      visibleLineup: recommendedOperators
        .slice(0, options.stackSize)
        .map((slug) => operatorNameBySlug.get(slug) ?? slug),
      benchLineup: recommendedOperators
        .slice(options.stackSize)
        .map((slug) => operatorNameBySlug.get(slug) ?? slug),
      assignments: collapseAssignmentsForStack(parsedAssignments, options.stackSize).map(
        (assignment) => ({
          ...assignment,
          operator: operatorNameBySlug.get(assignment.operator) ?? assignment.operator,
        }),
      ),
      watchouts,
      stepsByPhase,
    };
  });

  const relevantPatchNotes = filterRelevantPatchNotes(
    patchNotes,
    [
      map.name,
      site.name,
      ...new Set(
        hydratedStrategies.flatMap((strategy) => strategy.recommendedOperatorNames),
      ),
    ],
  );

  return {
    map,
    site,
    squads,
    notes,
    banRecommendation,
    strategies: hydratedStrategies,
    patchNotes: relevantPatchNotes,
    operators,
  };
}
