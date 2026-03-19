import { notFound } from "next/navigation";
import { RankBand, Side } from "@prisma/client";

import { PatchUpdateCard } from "@/components/patches/patch-update-card";
import { BanRecommendationCard } from "@/components/prep/ban-recommendation-card";
import { PrepPlanTabs } from "@/components/prep/prep-plan-tabs";
import { SquadNotesPanel } from "@/components/prep/squad-notes-panel";
import { EmptyState } from "@/components/states/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUserWithFallback } from "@/lib/demo-auth";
import { getPrepDetailData } from "@/lib/services/prep";
import { parseCsv } from "@/lib/utils";

function resolveSide(side: string) {
  if (side === "attack") {
    return Side.ATTACK;
  }

  if (side === "defense") {
    return Side.DEFENSE;
  }

  return null;
}

export default async function PrepDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ map: string; side: string; site: string }>;
  searchParams: Promise<{ stack?: string; comfort?: string }>;
}) {
  const [{ map, side, site }, query, currentUser] = await Promise.all([
    params,
    searchParams,
    getCurrentUserWithFallback(),
  ]);

  const resolvedSide = resolveSide(side);

  if (!resolvedSide) {
    notFound();
  }

  const stackSize = Math.min(Math.max(Number(query.stack ?? "5"), 1), 5);
  const comfortOperators = parseCsv(query.comfort);
  const rankBand = currentUser?.rankBand ?? RankBand.PLATINUM_EMERALD;

  const data = await getPrepDetailData({
    mapSlug: map,
    siteSlug: site,
    side: resolvedSide,
    stackSize,
    comfortOperators,
    rankBand,
  });

  if (!data) {
    notFound();
  }

  if (!data.strategies.length) {
    return (
      <EmptyState
        title="No strategy cards found"
        description="This map/site/side combination is missing seeded strategy content."
      />
    );
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{data.map.name}</Badge>
            <Badge variant="outline">{side}</Badge>
            <Badge variant="green">{stackSize} stack</Badge>
            {comfortOperators.length ? (
              <Badge variant="outline">{comfortOperators.length} comfort picks</Badge>
            ) : null}
          </div>
          <CardTitle className="font-display text-3xl">{data.site.name}</CardTitle>
          <CardDescription>
            Curated prep tabs for {side} with explainable bans, lineup coverage, and site
            reminders.
          </CardDescription>
        </CardHeader>
        {comfortOperators.length ? (
          <CardContent className="text-sm text-[color:var(--text-muted)]">
            Comfort pool: {comfortOperators.join(", ")}
          </CardContent>
        ) : null}
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <BanRecommendationCard recommendation={data.banRecommendation} />
        <SquadNotesPanel notes={data.notes} />
      </div>

      <PrepPlanTabs strategies={data.strategies} />

      <section className="grid gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--text-subtle)]">
            Patch-aware updates
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
            Context cards that may change how you prep this site.
          </h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {data.patchNotes.map((patch) => (
            <PatchUpdateCard key={patch.id} {...patch} />
          ))}
        </div>
      </section>
    </div>
  );
}
