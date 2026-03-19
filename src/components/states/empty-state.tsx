import { AlertCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type EmptyStateProps = {
  title: string;
  description: string;
  hint?: string;
};

export function EmptyState({ title, description, hint }: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <Badge variant="outline" className="w-fit">
          Empty
        </Badge>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-[color:var(--accent-strong)]" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {hint ? (
        <CardContent className="text-sm text-[color:var(--text-subtle)]">{hint}</CardContent>
      ) : null}
    </Card>
  );
}
