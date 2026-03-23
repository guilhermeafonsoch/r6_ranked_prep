import { notFound } from "next/navigation";

import {
  deleteNoteAction,
  deletePlaybookCardAction,
  deleteSquadAction,
  deleteSquadMemberAction,
  saveNoteAction,
  savePlaybookCardAction,
  saveSquadAction,
  saveSquadMemberAction,
} from "@/actions/playbook";
import { SubmitButton } from "@/components/ui/submit-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getPlaybookDetailData } from "@/lib/services/playbook";

function siteOptions(
  maps: {
    id: string;
    name: string;
    sites: { id: string; name: string }[];
  }[],
) {
  return maps.flatMap((map) =>
    map.sites.map((site) => ({
      id: site.id,
      label: `${map.name} · ${site.name}`,
    })),
  );
}

export default async function PlaybookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { squad, maps, users } = await getPlaybookDetailData(id);

  if (!squad) {
    notFound();
  }

  const siteSelectOptions = siteOptions(maps);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{squad.name}</Badge>
            <Badge variant="outline">{squad.members.length} members</Badge>
            <Badge variant="outline">{squad.playbookCards.length} cards</Badge>
          </div>
          <CardTitle className="font-display text-3xl">{squad.name}</CardTitle>
          <CardDescription>
            Tune the squad roster, store named prep cards, and keep map/site notes close to the queue flow.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
          <form action={saveSquadAction} className="grid gap-3">
            <input type="hidden" name="id" value={squad.id} />
            <div className="grid gap-2">
              <Label htmlFor="squad-name">Squad name</Label>
              <Input id="squad-name" name="name" defaultValue={squad.name} required />
            </div>
            <SubmitButton pendingLabel="Saving squad...">Save squad</SubmitButton>
          </form>
          <form action={deleteSquadAction}>
            <input type="hidden" name="id" value={squad.id} />
            <Button type="submit" variant="destructive">
              Delete squad
            </Button>
          </form>
        </CardContent>
      </Card>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Members and roles</CardTitle>
            <CardDescription>Add or update the squad roster for role ownership.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <form action={saveSquadMemberAction} className="grid gap-3 rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-0)] p-4">
              <input type="hidden" name="squadId" value={squad.id} />
              <div className="grid gap-2">
                <Label htmlFor="member-nickname">Nickname</Label>
                <Input id="member-nickname" name="nickname" placeholder="Vector" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="member-user">Link to user</Label>
                <select
                  id="member-user"
                  name="userId"
                  className="h-10 rounded-md border border-[color:var(--border-strong)] bg-[color:var(--surface-0)] px-3 text-sm"
                  defaultValue=""
                >
                  <option value="">Standalone nickname</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.displayName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="preferred-roles">Preferred roles</Label>
                <Input
                  id="preferred-roles"
                  name="preferredRolesText"
                  placeholder="IGL, Support"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="comfort-ops">Comfort operators</Label>
                <Input
                  id="comfort-ops"
                  name="comfortOperatorsText"
                  placeholder="ace, smoke, mute"
                />
              </div>
              <SubmitButton pendingLabel="Saving member...">Add member</SubmitButton>
            </form>

            {squad.members.map((member) => (
              <form
                key={member.id}
                action={saveSquadMemberAction}
                className="grid gap-3 rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-0)] p-4"
              >
                <input type="hidden" name="id" value={member.id} />
                <input type="hidden" name="squadId" value={squad.id} />
                <div className="grid gap-2">
                  <Label>Nickname</Label>
                  <Input name="nickname" defaultValue={member.nickname} required />
                </div>
                <div className="grid gap-2">
                  <Label>User</Label>
                  <select
                    name="userId"
                    className="h-10 rounded-md border border-[color:var(--border-strong)] bg-[color:var(--surface-0)] px-3 text-sm"
                    defaultValue={member.userId ?? ""}
                  >
                    <option value="">Standalone nickname</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.displayName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label>Preferred roles</Label>
                  <Input
                    name="preferredRolesText"
                    defaultValue={Array.isArray(member.preferredRoles) ? member.preferredRoles.join(", ") : ""}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Comfort operators</Label>
                  <Input
                    name="comfortOperatorsText"
                    defaultValue={Array.isArray(member.comfortOperators) ? member.comfortOperators.join(", ") : ""}
                  />
                </div>
                <div className="flex gap-3">
                  <SubmitButton pendingLabel="Saving member...">Save member</SubmitButton>
                  <Button formAction={deleteSquadMemberAction} variant="destructive">
                    Delete
                  </Button>
                </div>
              </form>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custom playbook cards</CardTitle>
            <CardDescription>Named cards for your squad’s own defaults and fallback ideas.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <form action={savePlaybookCardAction} className="grid gap-3 rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-0)] p-4">
              <input type="hidden" name="squadId" value={squad.id} />
              <div className="grid gap-2">
                <Label>Map</Label>
                <select name="mapId" className="h-10 rounded-md border border-[color:var(--border-strong)] bg-[color:var(--surface-0)] px-3 text-sm" defaultValue={maps[0]?.id}>
                  {maps.map((map) => (
                    <option key={map.id} value={map.id}>
                      {map.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label>Site</Label>
                <select name="siteId" className="h-10 rounded-md border border-[color:var(--border-strong)] bg-[color:var(--surface-0)] px-3 text-sm" defaultValue={siteSelectOptions[0]?.id}>
                  {siteSelectOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label>Title</Label>
                <Input name="title" placeholder="Server Rack Lock" required />
              </div>
              <div className="grid gap-2">
                <Label>Summary</Label>
                <Textarea name="summary" required />
              </div>
              <div className="grid gap-2">
                <Label>Preferred comp</Label>
                <Input name="preferredCompText" placeholder="azami, kaid, valkyrie" />
              </div>
              <div className="grid gap-2">
                <Label>Assigned roles JSON</Label>
                <Textarea
                  name="assignedRolesText"
                  defaultValue={`[
  { "player": "Vector", "role": "Denial backstop", "operator": "Kaid" }
]`}
                />
              </div>
              <div className="grid gap-2">
                <Label>Checklist lines</Label>
                <Textarea name="checklistText" placeholder="Hide a late camera&#10;Collapse if rafters falls" />
              </div>
              <SubmitButton pendingLabel="Saving card...">Add playbook card</SubmitButton>
            </form>

            {squad.playbookCards.map((card) => (
              <form
                key={card.id}
                action={savePlaybookCardAction}
                className="grid gap-3 rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-0)] p-4"
              >
                <input type="hidden" name="id" value={card.id} />
                <input type="hidden" name="squadId" value={squad.id} />
                <div className="grid gap-2">
                  <Label>Map</Label>
                  <select name="mapId" className="h-10 rounded-md border border-[color:var(--border-strong)] bg-[color:var(--surface-0)] px-3 text-sm" defaultValue={card.mapId}>
                    {maps.map((map) => (
                      <option key={map.id} value={map.id}>
                        {map.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label>Site</Label>
                  <select name="siteId" className="h-10 rounded-md border border-[color:var(--border-strong)] bg-[color:var(--surface-0)] px-3 text-sm" defaultValue={card.siteId}>
                    {siteSelectOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label>Title</Label>
                  <Input name="title" defaultValue={card.title} required />
                </div>
                <div className="grid gap-2">
                  <Label>Summary</Label>
                  <Textarea name="summary" defaultValue={card.summary} required />
                </div>
                <div className="grid gap-2">
                  <Label>Preferred comp</Label>
                  <Input
                    name="preferredCompText"
                    defaultValue={Array.isArray(card.preferredComp) ? card.preferredComp.join(", ") : ""}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Assigned roles JSON</Label>
                  <Textarea
                    name="assignedRolesText"
                    defaultValue={JSON.stringify(card.assignedRoles, null, 2)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Checklist lines</Label>
                  <Textarea
                    name="checklistText"
                    defaultValue={Array.isArray(card.checklist) ? card.checklist.join("\n") : ""}
                  />
                </div>
                <div className="flex gap-3">
                  <SubmitButton pendingLabel="Saving card...">Save card</SubmitButton>
                  <Button formAction={deletePlaybookCardAction} variant="destructive">
                    Delete
                  </Button>
                </div>
              </form>
            ))}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Saved notes</CardTitle>
          <CardDescription>
            Notes are tied to real maps and sites so prep reminders stay searchable.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form action={saveNoteAction} className="grid gap-3 rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-0)] p-4 lg:grid-cols-2">
            <input type="hidden" name="squadId" value={squad.id} />
            <div className="grid gap-2">
              <Label>Map</Label>
              <select name="mapId" className="h-10 rounded-md border border-[color:var(--border-strong)] bg-[color:var(--surface-0)] px-3 text-sm" defaultValue={maps[0]?.id}>
                {maps.map((map) => (
                  <option key={map.id} value={map.id}>
                    {map.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label>Site</Label>
              <select name="siteId" className="h-10 rounded-md border border-[color:var(--border-strong)] bg-[color:var(--surface-0)] px-3 text-sm" defaultValue={siteSelectOptions[0]?.id}>
                {siteSelectOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2 lg:col-span-2">
              <Label>Title</Label>
              <Input name="title" placeholder="Freezer drone habit" required />
            </div>
            <div className="grid gap-2 lg:col-span-2">
              <Label>Body</Label>
              <Textarea name="body" required />
            </div>
            <div className="lg:col-span-2">
              <SubmitButton pendingLabel="Saving note...">Add note</SubmitButton>
            </div>
          </form>

          {squad.notes.map((note) => (
            <form
              key={note.id}
              action={saveNoteAction}
              className="grid gap-3 rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-0)] p-4"
            >
              <input type="hidden" name="id" value={note.id} />
              <input type="hidden" name="squadId" value={squad.id} />
              <input type="hidden" name="mapId" value={note.mapId} />
              <input type="hidden" name="siteId" value={note.siteId} />
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline">{note.map.name}</Badge>
                <Badge variant="outline">{note.site.name}</Badge>
              </div>
              <div className="grid gap-2">
                <Label>Title</Label>
                <Input name="title" defaultValue={note.title} required />
              </div>
              <div className="grid gap-2">
                <Label>Body</Label>
                <Textarea name="body" defaultValue={note.body} required />
              </div>
              <div className="flex gap-3">
                <SubmitButton pendingLabel="Saving note...">Save note</SubmitButton>
                <Button formAction={deleteNoteAction} variant="destructive">
                  Delete
                </Button>
              </div>
            </form>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
