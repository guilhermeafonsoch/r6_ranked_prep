import { deleteStrategyAction, saveStrategyAction } from "@/actions/admin";
import { SubmitButton } from "@/components/ui/submit-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { prisma } from "@/lib/db";

export default async function AdminStrategiesPage() {
  const [maps, sites, strategies] = await Promise.all([
    prisma.map.findMany({ orderBy: { name: "asc" } }),
    prisma.site.findMany({
      include: { map: true },
      orderBy: [{ map: { name: "asc" } }, { name: "asc" }],
    }),
    prisma.strategyCard.findMany({
      include: {
        map: true,
        site: true,
        steps: { orderBy: [{ phase: "asc" }, { stepOrder: "asc" }] },
      },
      orderBy: [{ map: { name: "asc" } }, { site: { name: "asc" } }, { side: "asc" }],
    }),
  ]);

  const siteOptions = sites.map((site) => ({
    id: site.id,
    label: `${site.map.name} · ${site.name}`,
  }));

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Strategy cards</CardTitle>
          <CardDescription>Curated plans are saved as structured cards plus ordered steps.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={saveStrategyAction} className="grid gap-3">
            <div className="grid gap-3 md:grid-cols-2">
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
                <select name="siteId" className="h-10 rounded-md border border-[color:var(--border-strong)] bg-[color:var(--surface-0)] px-3 text-sm" defaultValue={siteOptions[0]?.id}>
                  {siteOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label>Side</Label>
                <select name="side" className="h-10 rounded-md border border-[color:var(--border-strong)] bg-[color:var(--surface-0)] px-3 text-sm" defaultValue="ATTACK">
                  <option value="ATTACK">Attack</option>
                  <option value="DEFENSE">Defense</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label>Plan type</Label>
                <select name="planType" className="h-10 rounded-md border border-[color:var(--border-strong)] bg-[color:var(--surface-0)] px-3 text-sm" defaultValue="SAFE">
                  <option value="SAFE">Safe</option>
                  <option value="AGGRESSIVE">Aggressive</option>
                  <option value="FALLBACK">Fallback</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label>Title</Label>
                <Input name="title" required />
              </div>
              <div className="grid gap-2">
                <Label>Team size</Label>
                <Input name="teamSize" type="number" min="1" max="5" defaultValue="5" required />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea name="description" required />
            </div>
            <div className="grid gap-2">
              <Label>Recommended operators</Label>
              <Input name="recommendedOperatorsText" placeholder="ace, thatcher, buck, nomad, dokkaebi" />
            </div>
            <div className="grid gap-2">
              <Label>Role assignments JSON</Label>
              <Textarea
                name="roleAssignmentsText"
                defaultValue={`[
  { "slot": "Slot 1", "role": "Breach lead", "operator": "ace", "responsibility": "Open the key wall.", "minStackSize": 1 }
]`}
              />
            </div>
            <div className="grid gap-2">
              <Label>Watchouts</Label>
              <Textarea name="watchoutsText" placeholder="Late flank&#10;Do not plant until rafters is isolated" />
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="grid gap-2">
                <Label>Setup steps</Label>
                <Textarea name="setupStepsText" />
              </div>
              <div className="grid gap-2">
                <Label>Execution steps</Label>
                <Textarea name="executionStepsText" />
              </div>
              <div className="grid gap-2">
                <Label>Contingency steps</Label>
                <Textarea name="contingencyStepsText" />
              </div>
            </div>
            <SubmitButton pendingLabel="Saving strategy...">Add strategy card</SubmitButton>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {strategies.map((strategy) => (
          <details
            key={strategy.id}
            className="rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-1)]"
          >
            <summary className="cursor-pointer list-none px-5 py-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge>{strategy.map.name}</Badge>
                <Badge variant="outline">{strategy.site.name}</Badge>
                <Badge variant="outline">{strategy.side.toLowerCase()}</Badge>
                <Badge variant="amber">{strategy.planType.toLowerCase()}</Badge>
                <span className="font-medium">{strategy.title}</span>
              </div>
            </summary>
            <div className="border-t border-[color:var(--border-subtle)] px-5 py-5">
              <form action={saveStrategyAction} className="grid gap-3">
                <input type="hidden" name="id" value={strategy.id} />
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>Map</Label>
                    <select name="mapId" className="h-10 rounded-md border border-[color:var(--border-strong)] bg-[color:var(--surface-0)] px-3 text-sm" defaultValue={strategy.mapId}>
                      {maps.map((map) => (
                        <option key={map.id} value={map.id}>
                          {map.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Site</Label>
                    <select name="siteId" className="h-10 rounded-md border border-[color:var(--border-strong)] bg-[color:var(--surface-0)] px-3 text-sm" defaultValue={strategy.siteId}>
                      {siteOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Side</Label>
                    <select name="side" className="h-10 rounded-md border border-[color:var(--border-strong)] bg-[color:var(--surface-0)] px-3 text-sm" defaultValue={strategy.side}>
                      <option value="ATTACK">Attack</option>
                      <option value="DEFENSE">Defense</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Plan type</Label>
                    <select name="planType" className="h-10 rounded-md border border-[color:var(--border-strong)] bg-[color:var(--surface-0)] px-3 text-sm" defaultValue={strategy.planType}>
                      <option value="SAFE">Safe</option>
                      <option value="AGGRESSIVE">Aggressive</option>
                      <option value="FALLBACK">Fallback</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Title</Label>
                    <Input name="title" defaultValue={strategy.title} required />
                  </div>
                  <div className="grid gap-2">
                    <Label>Team size</Label>
                    <Input name="teamSize" type="number" min="1" max="5" defaultValue={strategy.teamSize} required />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Description</Label>
                  <Textarea name="description" defaultValue={strategy.description} required />
                </div>
                <div className="grid gap-2">
                  <Label>Recommended operators</Label>
                  <Input
                    name="recommendedOperatorsText"
                    defaultValue={Array.isArray(strategy.recommendedOperators) ? strategy.recommendedOperators.join(", ") : ""}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Role assignments JSON</Label>
                  <Textarea
                    name="roleAssignmentsText"
                    defaultValue={JSON.stringify(strategy.roleAssignments, null, 2)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Watchouts</Label>
                  <Textarea
                    name="watchoutsText"
                    defaultValue={Array.isArray(strategy.watchouts) ? strategy.watchouts.join("\n") : ""}
                  />
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="grid gap-2">
                    <Label>Setup steps</Label>
                    <Textarea
                      name="setupStepsText"
                      defaultValue={strategy.steps.filter((step) => step.phase === "SETUP").map((step) => step.text).join("\n")}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Execution steps</Label>
                    <Textarea
                      name="executionStepsText"
                      defaultValue={strategy.steps.filter((step) => step.phase === "EXECUTION").map((step) => step.text).join("\n")}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Contingency steps</Label>
                    <Textarea
                      name="contingencyStepsText"
                      defaultValue={strategy.steps.filter((step) => step.phase === "CONTINGENCY").map((step) => step.text).join("\n")}
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <SubmitButton pendingLabel="Saving strategy...">Save strategy</SubmitButton>
                  <Button formAction={deleteStrategyAction} variant="destructive">
                    Delete
                  </Button>
                </div>
              </form>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
