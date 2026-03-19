import { deleteBanRuleAction, saveBanRuleAction } from "@/actions/admin";
import { SubmitButton } from "@/components/ui/submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { rankBandOptions } from "@/lib/constants";
import { prisma } from "@/lib/db";

export default async function AdminBansPage() {
  const [maps, banRules] = await Promise.all([
    prisma.map.findMany({ orderBy: { name: "asc" } }),
    prisma.banRule.findMany({
      include: { map: true },
      orderBy: [{ map: { name: "asc" } }, { rankBand: "asc" }],
    }),
  ]);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Ban rules</CardTitle>
          <CardDescription>
            Deterministic defaults that the ban assistant can explain and adjust.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={saveBanRuleAction} className="grid gap-3 md:grid-cols-2">
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
              <Label>Rank band</Label>
              <select name="rankBand" className="h-10 rounded-md border border-[color:var(--border-strong)] bg-[color:var(--surface-0)] px-3 text-sm" defaultValue={rankBandOptions[0]?.value}>
                <option value="ALL">All ranked bands</option>
                {rankBandOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label>Attack ban</Label>
              <Input name="attackBan" placeholder="jackal" required />
            </div>
            <div className="grid gap-2">
              <Label>Defense ban</Label>
              <Input name="defenseBan" placeholder="mira" required />
            </div>
            <div className="grid gap-2">
              <Label>Fallback attackers</Label>
              <Input name="fallbackAttackText" placeholder="thatcher, nomad" />
            </div>
            <div className="grid gap-2">
              <Label>Fallback defenders</Label>
              <Input name="fallbackDefenseText" placeholder="kaid, azami" />
            </div>
            <div className="grid gap-2">
              <Label>Weight</Label>
              <Input name="weight" type="number" min="0" defaultValue="90" required />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label>Rationale</Label>
              <Textarea name="rationale" required />
            </div>
            <div className="md:col-span-2">
              <SubmitButton pendingLabel="Saving ban rule...">Add ban rule</SubmitButton>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {banRules.map((rule) => (
          <form key={rule.id} action={saveBanRuleAction}>
            <Card>
              <CardHeader>
                <CardTitle>{rule.map.name} · {rule.rankBand}</CardTitle>
                <CardDescription>
                  {rule.attackBan} / {rule.defenseBan}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                <input type="hidden" name="id" value={rule.id} />
                <div className="grid gap-2">
                  <Label>Map</Label>
                  <select name="mapId" className="h-10 rounded-md border border-[color:var(--border-strong)] bg-[color:var(--surface-0)] px-3 text-sm" defaultValue={rule.mapId}>
                    {maps.map((map) => (
                      <option key={map.id} value={map.id}>
                        {map.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label>Rank band</Label>
                  <select name="rankBand" className="h-10 rounded-md border border-[color:var(--border-strong)] bg-[color:var(--surface-0)] px-3 text-sm" defaultValue={rule.rankBand}>
                    <option value="ALL">All ranked bands</option>
                    {rankBandOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label>Attack ban</Label>
                  <Input name="attackBan" defaultValue={rule.attackBan} required />
                </div>
                <div className="grid gap-2">
                  <Label>Defense ban</Label>
                  <Input name="defenseBan" defaultValue={rule.defenseBan} required />
                </div>
                <div className="grid gap-2">
                  <Label>Fallback attackers</Label>
                  <Input
                    name="fallbackAttackText"
                    defaultValue={
                      typeof rule.fallbackBans === "object" &&
                      rule.fallbackBans &&
                      Array.isArray((rule.fallbackBans as { attack?: unknown }).attack)
                        ? ((rule.fallbackBans as { attack: string[] }).attack).join(", ")
                        : ""
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Fallback defenders</Label>
                  <Input
                    name="fallbackDefenseText"
                    defaultValue={
                      typeof rule.fallbackBans === "object" &&
                      rule.fallbackBans &&
                      Array.isArray((rule.fallbackBans as { defense?: unknown }).defense)
                        ? ((rule.fallbackBans as { defense: string[] }).defense).join(", ")
                        : ""
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Weight</Label>
                  <Input name="weight" type="number" min="0" defaultValue={rule.weight} required />
                </div>
                <div className="grid gap-2 md:col-span-2">
                  <Label>Rationale</Label>
                  <Textarea name="rationale" defaultValue={rule.rationale} required />
                </div>
                <div className="flex gap-3 md:col-span-2">
                  <SubmitButton pendingLabel="Saving ban rule...">Save ban rule</SubmitButton>
                  <Button formAction={deleteBanRuleAction} variant="destructive">
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
