import { LoaderCircle } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type LoadingStateProps = {
  title?: string;
  description?: string;
};

export function LoadingState({
  title = "Loading tactical board",
  description = "Pulling map prep, saved notes, and patch context.",
}: LoadingStateProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LoaderCircle className="h-5 w-5 animate-spin text-[color:var(--accent-strong)]" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="h-3 rounded-full bg-white/5" />
        <div className="h-3 rounded-full bg-white/5" />
        <div className="h-3 w-2/3 rounded-full bg-white/5" />
      </CardContent>
    </Card>
  );
}
