"use client";

import { OperatorLineupCard } from "@/components/prep/operator-lineup-card";
import { RoleAssignmentCard } from "@/components/prep/role-assignment-card";
import { StrategyChecklist } from "@/components/prep/strategy-checklist";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PrepPlanTabsProps = {
  strategies: {
    id: string;
    planType: "SAFE" | "AGGRESSIVE" | "FALLBACK";
    title: string;
    description: string;
    visibleLineup: string[];
    benchLineup: string[];
    assignments: {
      slot: string;
      role: string;
      operator: string;
      responsibility: string;
      minStackSize: number;
      tags?: string[];
    }[];
    watchouts: string[];
    stepsByPhase: {
      setup: string[];
      execution: string[];
      contingency: string[];
    };
  }[];
};

const order: PrepPlanTabsProps["strategies"][number]["planType"][] = [
  "SAFE",
  "AGGRESSIVE",
  "FALLBACK",
];

export function PrepPlanTabs({ strategies }: PrepPlanTabsProps) {
  const first = strategies[0];

  return (
    <Tabs defaultValue={first?.planType ?? "SAFE"}>
      <TabsList>
        {order.map((planType) => (
          <TabsTrigger key={planType} value={planType}>
            {planType.toLowerCase()}
          </TabsTrigger>
        ))}
      </TabsList>

      {strategies.map((strategy) => (
        <TabsContent key={strategy.id} value={strategy.planType}>
          <div className="grid gap-4 xl:grid-cols-[1.3fr_0.9fr]">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>{strategy.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-[color:var(--text-muted)]">
                  {strategy.description}
                </CardContent>
              </Card>

              <div className="grid gap-4 lg:grid-cols-2">
                <StrategyChecklist
                  title="Setup checklist"
                  description="The shortest stable path into the round."
                  items={strategy.stepsByPhase.setup}
                  phase="setup"
                />
                <StrategyChecklist
                  title="Execution checklist"
                  description="The live-round commit sequence."
                  items={strategy.stepsByPhase.execution}
                  phase="execution"
                />
              </div>

              <StrategyChecklist
                title="Fallback checklist"
                description="What to do when the first idea breaks."
                items={strategy.stepsByPhase.contingency}
                phase="contingency"
              />
            </div>

            <div className="grid gap-4">
              <OperatorLineupCard lineup={strategy.visibleLineup} bench={strategy.benchLineup} />
              <RoleAssignmentCard assignments={strategy.assignments} />
              <Card>
                <CardHeader>
                  <CardTitle>Watchouts</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3">
                  {strategy.watchouts.map((watchout) => (
                    <div
                      key={watchout}
                      className="rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-0)] p-4 text-sm leading-6 text-[color:var(--text-muted)]"
                    >
                      {watchout}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
