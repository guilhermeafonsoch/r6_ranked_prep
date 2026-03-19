import { deleteSiteAction, saveSiteAction } from "@/actions/admin";
import { SubmitButton } from "@/components/ui/submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { prisma } from "@/lib/db";

export default async function AdminSitesPage() {
  const [maps, sites] = await Promise.all([
    prisma.map.findMany({ orderBy: { name: "asc" } }),
    prisma.site.findMany({
      include: { map: true },
      orderBy: [{ map: { name: "asc" } }, { name: "asc" }],
    }),
  ]);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Sites</CardTitle>
          <CardDescription>Control site slugs, difficulty, and ownership map.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={saveSiteAction} className="grid gap-3 md:grid-cols-2">
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
              <Label>Slug</Label>
              <Input name="slug" placeholder="cctv-cash" required />
            </div>
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input name="name" placeholder="CCTV / Cash" required />
            </div>
            <div className="grid gap-2">
              <Label>Difficulty</Label>
              <select name="difficulty" className="h-10 rounded-md border border-[color:var(--border-strong)] bg-[color:var(--surface-0)] px-3 text-sm" defaultValue="MEDIUM">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label>Side type</Label>
              <select name="sideType" className="h-10 rounded-md border border-[color:var(--border-strong)] bg-[color:var(--surface-0)] px-3 text-sm" defaultValue="DEFENSE">
                <option value="DEFENSE">Defense</option>
                <option value="ATTACK">Attack</option>
                <option value="FLEX">Flex</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <SubmitButton pendingLabel="Saving site...">Add site</SubmitButton>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {sites.map((site) => (
          <form key={site.id} action={saveSiteAction}>
            <Card>
              <CardHeader>
                <CardTitle>{site.map.name} · {site.name}</CardTitle>
                <CardDescription>{site.slug}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                <input type="hidden" name="id" value={site.id} />
                <div className="grid gap-2">
                  <Label>Map</Label>
                  <select name="mapId" className="h-10 rounded-md border border-[color:var(--border-strong)] bg-[color:var(--surface-0)] px-3 text-sm" defaultValue={site.mapId}>
                    {maps.map((map) => (
                      <option key={map.id} value={map.id}>
                        {map.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label>Slug</Label>
                  <Input name="slug" defaultValue={site.slug} required />
                </div>
                <div className="grid gap-2">
                  <Label>Name</Label>
                  <Input name="name" defaultValue={site.name} required />
                </div>
                <div className="grid gap-2">
                  <Label>Difficulty</Label>
                  <select name="difficulty" className="h-10 rounded-md border border-[color:var(--border-strong)] bg-[color:var(--surface-0)] px-3 text-sm" defaultValue={site.difficulty}>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label>Side type</Label>
                  <select name="sideType" className="h-10 rounded-md border border-[color:var(--border-strong)] bg-[color:var(--surface-0)] px-3 text-sm" defaultValue={site.sideType}>
                    <option value="DEFENSE">Defense</option>
                    <option value="ATTACK">Attack</option>
                    <option value="FLEX">Flex</option>
                  </select>
                </div>
                <div className="flex gap-3 md:col-span-2">
                  <SubmitButton pendingLabel="Saving site...">Save site</SubmitButton>
                  <Button formAction={deleteSiteAction} variant="destructive">
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
