import { MapSelector } from "@/components/map-selector";
import { SiteCard } from "@/components/prep/site-card";
import { EmptyState } from "@/components/states/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { getPrepIndexData } from "@/lib/services/prep";

export default async function PrepIndexPage() {
  const [maps, operators] = await Promise.all([
    getPrepIndexData(),
    prisma.operator.findMany({
      where: {
        active: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  if (!maps.length) {
    return (
      <EmptyState
        title="Prep pool not loaded"
        description="Seed the database to unlock map and site prep routes."
      />
    );
  }

  return (
    <div className="grid gap-6">
      <MapSelector
        maps={maps}
        operators={operators}
        title="Launch a prep board"
        description="Pick the exact site, side, stack size, and comfort picks you want to pressure-test."
      />

      <div className="grid gap-4">
        {maps.map((map) => (
          <Card key={map.id}>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>{map.name}</CardTitle>
                  <CardDescription>
                    Rotation tag {map.seasonTag} · {map.sites.length} seeded sites
                  </CardDescription>
                </div>
                <Badge variant={map.inRotation ? "green" : "outline"}>
                  {map.inRotation ? "In rotation" : "Out of rotation"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {map.sites.map((site) => (
                <SiteCard key={site.id} mapSlug={map.slug} site={site} />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
