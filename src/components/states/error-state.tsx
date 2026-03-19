import { ShieldAlert } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ErrorStateProps = {
  title: string;
  description: string;
};

export function ErrorState({ title, description }: ErrorStateProps) {
  return (
    <Card className="border-rose-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-rose-100">
          <ShieldAlert className="h-5 w-5 text-rose-300" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-[color:var(--text-subtle)]">
        Check the seeded database content or refresh the route once the action completes.
      </CardContent>
    </Card>
  );
}
