import Link from "next/link";
import { Users } from "lucide-react";

import { saveSquadAction } from "@/actions/playbook";
import { EmptyState } from "@/components/states/empty-state";
import { SubmitButton } from "@/components/ui/submit-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getPlaybookIndexData } from "@/lib/services/playbook";

export default async function PlaybookIndexPage() {
  const { squads } = await getPlaybookIndexData();

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[color:var(--accent-strong)]" />
            Squad playbooks
          </CardTitle>
          <CardDescription>
            Save squads, assign roles, and pin map-specific notes that matter in the operator select window.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={saveSquadAction} className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
            <div className="grid gap-2">
              <Label htmlFor="new-squad-name">New squad name</Label>
              <Input id="new-squad-name" name="name" placeholder="Night Shift" required />
            </div>
            <SubmitButton>Create squad</SubmitButton>
          </form>
        </CardContent>
      </Card>

      {squads.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {squads.map((squad) => (
            <Card key={squad.id}>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>{squad.name}</CardTitle>
                  <Badge variant="outline">{squad.members.length} members</Badge>
                </div>
                <CardDescription>
                  {squad.playbookCards.length} custom cards · {squad.notes.length} saved notes
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                {squad.playbookCards.slice(0, 3).map((card) => (
                  <div
                    key={card.id}
                    className="rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-0)] p-4"
                  >
                    <p className="font-medium">{card.title}</p>
                    <p className="mt-2 text-sm text-[color:var(--text-muted)]">
                      {card.map.name} · {card.site.name}
                    </p>
                  </div>
                ))}
                <Button asChild variant="secondary">
                  <Link href={`/playbook/${squad.id}`}>Open squad board</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No squads saved"
          description="Create your first squad above to start storing notes and playbook cards."
        />
      )}
    </div>
  );
}
