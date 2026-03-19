import { format } from "date-fns";
import { Radar } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type PatchUpdateCardProps = {
  seasonTag: string;
  title: string;
  summary: string;
  tacticalImplication: string;
  publishedAt: Date;
};

export function PatchUpdateCard({
  seasonTag,
  title,
  summary,
  tacticalImplication,
  publishedAt,
}: PatchUpdateCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <Badge variant="amber">{seasonTag}</Badge>
          <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--text-subtle)]">
            {format(publishedAt, "MMM d, yyyy")}
          </p>
        </div>
        <CardTitle className="flex items-start gap-2">
          <Radar className="mt-1 h-4 w-4 text-[color:var(--accent-strong)]" />
          <span>{title}</span>
        </CardTitle>
        <CardDescription>{summary}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm leading-6 text-[color:var(--text-muted)]">
        <span className="font-semibold text-[color:var(--text-strong)]">
          What this means for ranked prep:
        </span>{" "}
        {tacticalImplication}
      </CardContent>
    </Card>
  );
}
