import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";

export default async function AdminOverviewPage() {
  const [maps, sites, operators, strategies, bans, patches, rotations] =
    await Promise.all([
      prisma.map.count(),
      prisma.site.count(),
      prisma.operator.count(),
      prisma.strategyCard.count(),
      prisma.banRule.count(),
      prisma.patchNote.count(),
      prisma.mapRotationEvent.count(),
    ]);

  const cards = [
    { label: "Maps", value: maps, href: "/admin/maps", description: "Rotation and map metadata" },
    { label: "Sites", value: sites, href: "/admin/sites", description: "Site slugs and difficulty tags" },
    { label: "Operators", value: operators, href: "/admin/operators", description: "Operator pool and role tags" },
    { label: "Strategies", value: strategies, href: "/admin/strategies", description: "Plan cards and checklists" },
    { label: "Ban rules", value: bans, href: "/admin/bans", description: "Deterministic map ban inputs" },
    { label: "Patch notes", value: patches, href: "/admin/patches", description: "Patch-aware update cards" },
    { label: "Rotation events", value: rotations, href: "/admin/patches", description: "Seasonal map pool changes" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <Link key={card.label} href={card.href}>
          <Card className="h-full transition hover:border-[color:var(--border-strong)] hover:bg-[color:var(--surface-2)]">
            <CardHeader>
              <CardTitle>{card.label}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{card.value}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
