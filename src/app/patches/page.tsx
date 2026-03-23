import { PatchUpdateCard } from "@/components/patches/patch-update-card";
import { RotationEventCard } from "@/components/patches/rotation-event-card";
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
            <RotationEventCard key={event.id} {...event} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
