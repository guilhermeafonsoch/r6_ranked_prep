import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDifficulty } from "@/lib/utils";

type SiteCardProps = {
  mapSlug: string;
  site: {
    slug: string;
    name: string;
    difficulty: "LOW" | "MEDIUM" | "HIGH";
  };
};

export function SiteCard({ mapSlug, site }: SiteCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>{site.name}</CardTitle>
          <Badge variant="outline">{formatDifficulty(site.difficulty)}</Badge>
        </div>
        <CardDescription>
          Launch the site board directly on attack or defense.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        <Button asChild size="sm">
          <Link href={`/prep/${mapSlug}/attack/${site.slug}`}>
            Attack
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild size="sm" variant="secondary">
          <Link href={`/prep/${mapSlug}/defense/${site.slug}`}>
            Defense
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
