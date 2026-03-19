import { ShieldBan, ShieldQuestion } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { BanRecommendation } from "@/lib/types";

type BanRecommendationCardProps = {
  recommendation: BanRecommendation | null;
};

export function BanRecommendationCard({
  recommendation,
}: BanRecommendationCardProps) {
  if (!recommendation) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldQuestion className="h-5 w-5 text-[color:var(--text-subtle)]" />
            Ban logic unavailable
          </CardTitle>
          <CardDescription>Seeded ban rules are missing for this map.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ShieldBan className="h-5 w-5 text-[color:var(--accent-strong)]" />
              Recommended bans
            </CardTitle>
            <CardDescription>{recommendation.mapName}</CardDescription>
          </div>
          <Badge>{recommendation.confidence}</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-0)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--text-subtle)]">
              Attacker ban
            </p>
            <p className="mt-2 text-lg font-semibold">{recommendation.attackBan}</p>
            {recommendation.fallbackAttack.length ? (
              <p className="mt-2 text-sm text-[color:var(--text-muted)]">
                Fallbacks: {recommendation.fallbackAttack.join(", ")}
              </p>
            ) : null}
          </div>
          <div className="rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-0)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--text-subtle)]">
              Defender ban
            </p>
            <p className="mt-2 text-lg font-semibold">{recommendation.defenseBan}</p>
            {recommendation.fallbackDefense.length ? (
              <p className="mt-2 text-sm text-[color:var(--text-muted)]">
                Fallbacks: {recommendation.fallbackDefense.join(", ")}
              </p>
            ) : null}
          </div>
        </div>
        <p className="text-sm leading-6 text-[color:var(--text-muted)]">
          {recommendation.rationale}
        </p>
      </CardContent>
    </Card>
  );
}
