import { Layers3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type OperatorLineupCardProps = {
  title?: string;
  lineup: string[];
  bench?: string[];
};

export function OperatorLineupCard({
  title = "Default lineup",
  lineup,
  bench = [],
}: OperatorLineupCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers3 className="h-5 w-5 text-[color:var(--accent-strong)]" />
          {title}
        </CardTitle>
        <CardDescription>Core operators for the selected stack size.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="flex flex-wrap gap-2">
          {lineup.map((operator) => (
            <Badge key={operator}>{operator}</Badge>
          ))}
        </div>
        {bench.length ? (
          <p className="text-sm text-[color:var(--text-muted)]">
            Add next: {bench.join(", ")}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
