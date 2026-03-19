import {
  deletePatchNoteAction,
  deleteRotationEventAction,
  savePatchNoteAction,
  saveRotationEventAction,
} from "@/actions/admin";
import { SubmitButton } from "@/components/ui/submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { prisma } from "@/lib/db";

export default async function AdminPatchesPage() {
  const [patchNotes, rotationEvents] = await Promise.all([
    prisma.patchNote.findMany({ orderBy: { publishedAt: "desc" } }),
    prisma.mapRotationEvent.findMany({ orderBy: { effectiveDate: "desc" } }),
  ]);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Patch notes</CardTitle>
          <CardDescription>Seed or update patch-aware ranked prep cards.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={savePatchNoteAction} className="grid gap-3">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>Season tag</Label>
                <Input name="seasonTag" placeholder="Y11S1 Demo" required />
              </div>
              <div className="grid gap-2">
                <Label>Published at</Label>
                <Input name="publishedAt" type="date" required />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Title</Label>
              <Input name="title" required />
            </div>
            <div className="grid gap-2">
              <Label>Summary</Label>
              <Textarea name="summary" required />
            </div>
            <div className="grid gap-2">
              <Label>Tactical implication</Label>
              <Textarea name="tacticalImplication" required />
            </div>
            <SubmitButton pendingLabel="Saving patch...">Add patch note</SubmitButton>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {patchNotes.map((patch) => (
          <form key={patch.id} action={savePatchNoteAction}>
            <Card>
              <CardHeader>
                <CardTitle>{patch.title}</CardTitle>
                <CardDescription>{patch.seasonTag}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                <input type="hidden" name="id" value={patch.id} />
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>Season tag</Label>
                    <Input name="seasonTag" defaultValue={patch.seasonTag} required />
                  </div>
                  <div className="grid gap-2">
                    <Label>Published at</Label>
                    <Input
                      name="publishedAt"
                      type="date"
                      defaultValue={patch.publishedAt.toISOString().slice(0, 10)}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Title</Label>
                  <Input name="title" defaultValue={patch.title} required />
                </div>
                <div className="grid gap-2">
                  <Label>Summary</Label>
                  <Textarea name="summary" defaultValue={patch.summary} required />
                </div>
                <div className="grid gap-2">
                  <Label>Tactical implication</Label>
                  <Textarea
                    name="tacticalImplication"
                    defaultValue={patch.tacticalImplication}
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <SubmitButton pendingLabel="Saving patch...">Save patch</SubmitButton>
                  <Button formAction={deletePatchNoteAction} variant="destructive">
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rotation events</CardTitle>
          <CardDescription>Track map pool changes separately from patch summary cards.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={saveRotationEventAction} className="grid gap-3">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>Season tag</Label>
                <Input name="seasonTag" placeholder="Y11S1 Demo" required />
              </div>
              <div className="grid gap-2">
                <Label>Effective date</Label>
                <Input name="effectiveDate" type="date" required />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>Added maps</Label>
                <Input name="addedMapsText" placeholder="Chalet, Border" />
              </div>
              <div className="grid gap-2">
                <Label>Removed maps</Label>
                <Input name="removedMapsText" placeholder="Skyscraper" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Notes</Label>
              <Textarea name="notes" required />
            </div>
            <SubmitButton pendingLabel="Saving event...">Add rotation event</SubmitButton>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {rotationEvents.map((event) => (
          <form key={event.id} action={saveRotationEventAction}>
            <Card>
              <CardHeader>
                <CardTitle>{event.seasonTag}</CardTitle>
                <CardDescription>{event.effectiveDate.toISOString().slice(0, 10)}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                <input type="hidden" name="id" value={event.id} />
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>Season tag</Label>
                    <Input name="seasonTag" defaultValue={event.seasonTag} required />
                  </div>
                  <div className="grid gap-2">
                    <Label>Effective date</Label>
                    <Input
                      name="effectiveDate"
                      type="date"
                      defaultValue={event.effectiveDate.toISOString().slice(0, 10)}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>Added maps</Label>
                    <Input
                      name="addedMapsText"
                      defaultValue={Array.isArray(event.addedMaps) ? event.addedMaps.join(", ") : ""}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Removed maps</Label>
                    <Input
                      name="removedMapsText"
                      defaultValue={Array.isArray(event.removedMaps) ? event.removedMaps.join(", ") : ""}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Notes</Label>
                  <Textarea name="notes" defaultValue={event.notes} required />
                </div>
                <div className="flex gap-3">
                  <SubmitButton pendingLabel="Saving event...">Save rotation event</SubmitButton>
                  <Button formAction={deleteRotationEventAction} variant="destructive">
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        ))}
      </div>
    </div>
  );
}
