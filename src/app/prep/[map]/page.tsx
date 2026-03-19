import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ShieldBan } from "lucide-react";
import { RankBand } from "@prisma/client";

import { BanRecommendationCard } from "@/components/prep/ban-recommendation-card";
import { SiteCard } from "@/components/prep/site-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getBanRecommendation } from "@/lib/services/ban-assistant";
import { getMapOverviewData } from "@/lib/services/prep";

export default async function MapOverviewPage({
  params,
}: {
  params: Promise<{ map: string }>;
}) {
  const { map: mapSlug } = await params;
  const data = await getMapOverviewData(mapSlug);

  if (!data) {
    notFound();
  }

  const recommendation = await getBanRecommendation({
    mapSlug: data.slug,
    rankBand: RankBand.PLATINUM_EMERALD,
    comfortOperators: [],
    playstyle: "BALANCED",
    stackSize: 5,
  });

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{data.name}</Badge>
            <Badge variant="outline">{data.seasonTag}</Badge>
            <Badge variant={data.inRotation ? "green" : "outline"}>
              {data.inRotation ? "In rotation" : "Out of rotation"}
            </Badge>
          </div>
          <CardTitle className="font-display text-3xl">{data.name}</CardTitle>
          <CardDescription>
            Use the site cards below to jump directly into side-specific prep tabs.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href={`/prep/${data.slug}/attack/${data.sites[0]?.slug ?? ""}`}>
              Open first attack plan
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/bans">
              Open ban assistant
              <ShieldBan className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <BanRecommendationCard recommendation={recommendation} />

      <div className="grid gap-4 md:grid-cols-2">
        {data.sites.map((site) => (
          <SiteCard key={site.id} mapSlug={data.slug} site={site} />
        ))}
      </div>
    </div>
  );
}
