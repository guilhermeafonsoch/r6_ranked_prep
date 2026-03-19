import Link from "next/link";
import { ArrowRight, BookText, Layers3, NotebookPen } from "lucide-react";

import { MapSelector } from "@/components/map-selector";
import { PatchUpdateCard } from "@/components/patches/patch-update-card";
import { RecentPlansPanel } from "@/components/recent-plans-panel";
import { EmptyState } from "@/components/states/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { getDashboardData } from "@/lib/services/dashboard";

export default async function DashboardPage() {
  const [{ maps, patches, squads, latestNotes, rotationEvents }, operators] =
    await Promise.all([
      getDashboardData(),
      prisma.operator.findMany({
        where: {
          active: true,
        },
        orderBy: {
          name: "asc",
        },
      }),
    ]);

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <Card className="overflow-hidden">
          <CardHeader>
            <Badge className="w-fit">Second-screen MVP</Badge>
            <CardTitle className="max-w-2xl font-display text-3xl leading-tight">
              Fast tactical prep for ranked bans, default lineups, and site plans.
            </CardTitle>
            <CardDescription className="max-w-2xl">
              The app stays focused on pre-match decision speed: map, side, site, stack,
              comfort picks, then a clean prep board you can actually use between queue pop
              and operator select.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-0)] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--text-subtle)]">
                Active maps
              </p>
              <p className="mt-2 text-3xl font-semibold">{maps.length}</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-0)] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--text-subtle)]">
                Patch cards
              </p>
              <p className="mt-2 text-3xl font-semibold">{patches.length}</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-0)] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--text-subtle)]">
                Saved squads
              </p>
              <p className="mt-2 text-3xl font-semibold">{squads.length}</p>
            </div>
          </CardContent>
        </Card>

        <RecentPlansPanel />
      </section>

      {maps.length ? (
        <MapSelector maps={maps} operators={operators} />
      ) : (
        <EmptyState
          title="No maps seeded yet"
          description="Run the Prisma seed to populate the ranked map pool."
        />
      )}

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookText className="h-5 w-5 text-[color:var(--accent-strong)]" />
              Saved squad playbooks
            </CardTitle>
            <CardDescription>
              A fast view into your saved squads, note volume, and custom prep cards.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {squads.length ? (
              squads.map((squad) => (
                <Link
                  key={squad.id}
                  href={`/playbook/${squad.id}`}
                  className="rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-0)] p-4 transition hover:border-[color:var(--border-strong)] hover:bg-[color:var(--surface-2)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{squad.name}</p>
                    <Badge variant="outline">{squad.members.length} members</Badge>
                  </div>
                  <p className="mt-2 text-sm text-[color:var(--text-muted)]">
                    {squad.playbookCards.length} cards · {squad.notes.length} saved notes
                  </p>
                </Link>
              ))
            ) : (
              <p className="text-sm text-[color:var(--text-subtle)]">
                Create a squad from the playbook page to start saving custom cards.
              </p>
            )}
            <div className="pt-2">
              <Button asChild variant="secondary">
                <Link href="/playbook">
                  Open playbooks
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <NotebookPen className="h-5 w-5 text-[color:var(--accent-strong)]" />
              Recent note pressure
            </CardTitle>
            <CardDescription>
              Latest reminders anchored to real maps and sites from the seeded demo data.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {latestNotes.length ? (
              latestNotes.map((note) => (
                <div
                  key={note.id}
                  className="rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-0)] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{note.title}</p>
                    <Badge variant="outline">{note.map.name}</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--text-muted)]">
                    {note.body}
                  </p>
                  <p className="mt-3 text-xs uppercase tracking-[0.14em] text-[color:var(--text-subtle)]">
                    {note.site.name}
                    {note.squad ? ` · ${note.squad.name}` : ""}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-[color:var(--text-subtle)]">
                No seeded notes were found.
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="grid gap-4 md:grid-cols-2">
          {patches.map((patch) => (
            <PatchUpdateCard key={patch.id} {...patch} />
          ))}
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers3 className="h-5 w-5 text-[color:var(--accent-strong)]" />
              Rotation timeline
            </CardTitle>
            <CardDescription>
              Rotation events are data-driven so future pool changes stay configurable.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {rotationEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-0)] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <Badge variant="amber">{event.seasonTag}</Badge>
                  <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--text-subtle)]">
                    {event.effectiveDate.toLocaleDateString()}
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
      </section>
    </div>
  );
}
