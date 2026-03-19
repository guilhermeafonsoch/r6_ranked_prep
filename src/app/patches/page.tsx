import { format } from "date-fns";

import { PatchUpdateCard } from "@/components/patches/patch-update-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getPatchFeedData } from "@/lib/services/patches";

export default async function PatchesPage() {
  const { patchNotes, rotationEvents } = await getPatchFeedData();

  return (
    <div className="grid gap-6">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--text-subtle)]">
          Patch update feed
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">
          Curated patch-aware prep context for the current MVP dataset.
        </h2>
      </section>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {patchNotes.map((patch) => (
          <PatchUpdateCard key={patch.id} {...patch} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rotation timeline</CardTitle>
          <CardDescription>
            Map rotation changes are stored as data so the pool can evolve without touching
            application logic.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {rotationEvents.map((event) => (
            <div
              key={event.id}
              className="rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-0)] p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Badge variant="amber">{event.seasonTag}</Badge>
                <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--text-subtle)]">
                  {format(event.effectiveDate, "MMM d, yyyy")}
                </p>
              </div>
              <p className="mt-3 text-sm text-[color:var(--text-muted)]">
                Added: {(event.addedMaps as string[]).join(", ")} · Removed:{" "}
                {(event.removedMaps as string[]).join(", ")}
              </p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--text-muted)]">
                {event.notes}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
