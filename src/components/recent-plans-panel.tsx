"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePrepStore } from "@/store/use-prep-store";

export function RecentPlansPanel() {
  const recentPlans = usePrepStore((state) => state.recentPlans);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent plans</CardTitle>
        <CardDescription>Saved locally so your last prep routes stay one click away.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {recentPlans.length ? (
          recentPlans.map((plan) => (
            <Link
              key={`${plan.mapSlug}-${plan.siteSlug}-${plan.side}`}
              href={`/prep/${plan.mapSlug}/${plan.side}/${plan.siteSlug}?stack=${plan.stackSize}${
                plan.comfortOperators.length ? `&comfort=${plan.comfortOperators.join(",")}` : ""
              }`}
              className="rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-0)] p-4 transition hover:border-[color:var(--border-strong)] hover:bg-[color:var(--surface-2)]"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-[color:var(--text-strong)]">
                  {plan.mapName} · {plan.siteName}
                </p>
                <Badge variant="outline">{plan.side}</Badge>
              </div>
              <p className="mt-2 text-sm text-[color:var(--text-muted)]">
                {plan.stackSize} stack
                {plan.comfortOperators.length
                  ? ` · ${plan.comfortOperators.length} comfort picks`
                  : " · no comfort picks locked"}
              </p>
            </Link>
          ))
        ) : (
          <p className="text-sm text-[color:var(--text-subtle)]">
            Your next prep route will show up here after the first launch.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
