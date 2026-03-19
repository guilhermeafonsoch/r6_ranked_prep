import { deleteMapAction, saveMapAction } from "@/actions/admin";
import { SubmitButton } from "@/components/ui/submit-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { prisma } from "@/lib/db";

export default async function AdminMapsPage() {
  const maps = await prisma.map.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Maps</CardTitle>
          <CardDescription>Manage map rotation, slugs, and season tags.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={saveMapAction} className="grid gap-3 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>Slug</Label>
              <Input name="slug" placeholder="clubhouse" required />
            </div>
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input name="name" placeholder="Clubhouse" required />
            </div>
            <div className="grid gap-2">
              <Label>Season tag</Label>
              <Input name="seasonTag" placeholder="Y11S1 Demo" required />
            </div>
            <div className="grid gap-2">
              <Label>Image URL</Label>
              <Input name="imageUrl" placeholder="Optional" />
            </div>
            <label className="flex items-center gap-3 text-sm text-[color:var(--text-muted)]">
              <input type="checkbox" name="inRotation" defaultChecked className="h-4 w-4" />
              In ranked rotation
            </label>
            <div className="md:col-span-2">
              <SubmitButton pendingLabel="Saving map...">Add map</SubmitButton>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {maps.map((map) => (
          <form key={map.id} action={saveMapAction}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle>{map.name}</CardTitle>
                    <CardDescription>{map.slug}</CardDescription>
                  </div>
                  <Badge variant={map.inRotation ? "green" : "outline"}>
                    {map.inRotation ? "In rotation" : "Out"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                <input type="hidden" name="id" value={map.id} />
                <div className="grid gap-2">
                  <Label>Slug</Label>
                  <Input name="slug" defaultValue={map.slug} required />
                </div>
                <div className="grid gap-2">
                  <Label>Name</Label>
                  <Input name="name" defaultValue={map.name} required />
                </div>
                <div className="grid gap-2">
                  <Label>Season tag</Label>
                  <Input name="seasonTag" defaultValue={map.seasonTag} required />
                </div>
                <div className="grid gap-2">
                  <Label>Image URL</Label>
                  <Input name="imageUrl" defaultValue={map.imageUrl ?? ""} />
                </div>
                <label className="flex items-center gap-3 text-sm text-[color:var(--text-muted)]">
                  <input
                    type="checkbox"
                    name="inRotation"
                    defaultChecked={map.inRotation}
                    className="h-4 w-4"
                  />
                  In ranked rotation
                </label>
                <div className="flex gap-3 md:col-span-2">
                  <SubmitButton pendingLabel="Saving map...">Save map</SubmitButton>
                  <Button formAction={deleteMapAction} variant="destructive">
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
