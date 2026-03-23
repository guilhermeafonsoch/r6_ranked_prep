import { ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ErrorStateProps = {
  title: string;
  description: string;
  reset?: () => void;
};

export function ErrorState({ title, description, reset }: ErrorStateProps) {
  return (
    <Card className="border-rose-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-rose-100">
          <ShieldAlert className="h-5 w-5 text-rose-300" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-4 text-sm text-[color:var(--text-subtle)]">
        <span>Check the seeded database content or refresh the route once the action completes.</span>
        {reset ? (
          <Button variant="outline" size="sm" onClick={reset}>
            Try again
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
