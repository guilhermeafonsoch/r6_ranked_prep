import { Radar, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";

type TopNavProps = {
  userName: string | null | undefined;
};

export function TopNav({ userName }: TopNavProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-[color:var(--border-subtle)] px-5 py-4 md:flex-row md:items-center md:justify-between md:px-8">
      <div>
        <div className="flex items-center gap-2 text-[color:var(--text-subtle)]">
          <Radar className="h-4 w-4 text-[color:var(--accent-strong)]" />
          <span className="text-xs font-semibold uppercase tracking-[0.16em]">
            Tactical clipboard
          </span>
        </div>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[color:var(--text-strong)]">
          Prep ranked plans in under ninety seconds.
        </h1>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="outline">Curated defaults</Badge>
        <Badge variant="green" className="gap-1">
          <Sparkles className="h-3.5 w-3.5" />
          {userName ?? "Demo session"}
        </Badge>
      </div>
    </header>
  );
}
