import { RankBand } from "@prisma/client";

import { BanAssistantForm } from "@/components/ban-assistant-form";
import { BanRecommendationCard } from "@/components/prep/ban-recommendation-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { getCurrentUserWithFallback } from "@/lib/demo-auth";
import { getBanRecommendation } from "@/lib/services/ban-assistant";
import { parseCsv } from "@/lib/utils";

export default async function BansPage({
  searchParams,
}: {
  searchParams: Promise<{
    map?: string;
    rankBand?: RankBand;
    playstyle?: "SAFE" | "BALANCED" | "AGGRESSIVE";
    stack?: string;
    comfort?: string;
  }>;
}) {
  const [query, currentUser, maps, operators] = await Promise.all([
    searchParams,
    getCurrentUserWithFallback(),
    prisma.map.findMany({
      where: { inRotation: true },
      orderBy: { name: "asc" },
    }),
    prisma.operator.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const initialValues = {
    mapSlug: query.map ?? maps[0]?.slug ?? "",
    rankBand: query.rankBand ?? currentUser?.rankBand ?? RankBand.PLATINUM_EMERALD,
    playstyle: query.playstyle ?? "BALANCED",
    stackSize: Math.min(Math.max(Number(query.stack ?? "5"), 1), 5),
    comfortOperators: parseCsv(query.comfort),
  } as const;

  const recommendation = initialValues.mapSlug
    ? await getBanRecommendation({
        mapSlug: initialValues.mapSlug,
        rankBand: initialValues.rankBand,
        playstyle: initialValues.playstyle,
        stackSize: initialValues.stackSize,
        comfortOperators: initialValues.comfortOperators,
      })
    : null;

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <BanAssistantForm
        maps={maps}
        operators={operators}
        initialValues={initialValues}
      />

      <div className="grid gap-4">
        <BanRecommendationCard recommendation={recommendation} />
        <Card>
          <CardHeader>
            <CardTitle>Why this stays explainable</CardTitle>
            <CardDescription>
              The MVP intentionally uses transparent rules instead of black-box scoring.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm leading-6 text-[color:var(--text-muted)]">
            {recommendation?.adjustments.map((adjustment) => (
              <div
                key={adjustment}
                className="rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-0)] p-4"
              >
                {adjustment}
              </div>
            )) ?? (
              <p>No adjustments were applied beyond the map baseline.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
