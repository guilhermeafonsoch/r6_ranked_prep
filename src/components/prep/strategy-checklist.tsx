import { CheckCheck, Flag, Milestone } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type StrategyChecklistProps = {
  title: string;
  description: string;
  items: string[];
  phase: "setup" | "execution" | "contingency";
};

const icons = {
  setup: Flag,
  execution: CheckCheck,
  contingency: Milestone,
};

export function StrategyChecklist({
  title,
  description,
  items,
  phase,
}: StrategyChecklistProps) {
  const Icon = icons[phase];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-[color:var(--accent-strong)]" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="grid gap-3">
          {items.map((item, index) => (
            <li
              key={`${phase}-${index}`}
              className="rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-0)] p-4 text-sm leading-6 text-[color:var(--text-muted)]"
            >
              <span className="mr-2 font-semibold text-[color:var(--text-strong)]">
                {index + 1}.
              </span>
              {item}
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
