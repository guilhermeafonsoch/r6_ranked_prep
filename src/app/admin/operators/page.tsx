import { deleteOperatorAction, saveOperatorAction } from "@/actions/admin";
import { SubmitButton } from "@/components/ui/submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { prisma } from "@/lib/db";

export default async function AdminOperatorsPage() {
  const operators = await prisma.operator.findMany({
    orderBy: [{ side: "asc" }, { name: "asc" }],
  });

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Operators</CardTitle>
          <CardDescription>Manage the demo operator pool and role tags used by ban logic.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={saveOperatorAction} className="grid gap-3 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>Slug</Label>
              <Input name="slug" placeholder="ace" required />
            </div>
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input name="name" placeholder="Ace" required />
            </div>
            <div className="grid gap-2">
              <Label>Side</Label>
              <select name="side" className="h-10 rounded-md border border-[color:var(--border-strong)] bg-[color:var(--surface-0)] px-3 text-sm" defaultValue="ATTACK">
                <option value="ATTACK">Attack</option>
                <option value="DEFENSE">Defense</option>
              </select>
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
              <Label>Role tags</Label>
              <Input name="roleTagsText" placeholder="hard-breach, execute, plant" />
            </div>
            <label className="flex items-center gap-3 text-sm text-[color:var(--text-muted)]">
              <input type="checkbox" name="active" defaultChecked className="h-4 w-4" />
              Active in demo pool
            </label>
            <div className="md:col-span-2">
              <SubmitButton pendingLabel="Saving operator...">Add operator</SubmitButton>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {operators.map((operator) => (
          <form key={operator.id} action={saveOperatorAction}>
            <Card>
              <CardHeader>
                <CardTitle>{operator.name}</CardTitle>
                <CardDescription>{operator.slug}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                <input type="hidden" name="id" value={operator.id} />
                <div className="grid gap-2">
                  <Label>Slug</Label>
                  <Input name="slug" defaultValue={operator.slug} required />
                </div>
                <div className="grid gap-2">
                  <Label>Name</Label>
                  <Input name="name" defaultValue={operator.name} required />
                </div>
                <div className="grid gap-2">
                  <Label>Side</Label>
                  <select name="side" className="h-10 rounded-md border border-[color:var(--border-strong)] bg-[color:var(--surface-0)] px-3 text-sm" defaultValue={operator.side}>
                    <option value="ATTACK">Attack</option>
                    <option value="DEFENSE">Defense</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label>Difficulty</Label>
                  <select name="difficulty" className="h-10 rounded-md border border-[color:var(--border-strong)] bg-[color:var(--surface-0)] px-3 text-sm" defaultValue={operator.difficulty}>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label>Role tags</Label>
                  <Input
                    name="roleTagsText"
                    defaultValue={Array.isArray(operator.roleTags) ? operator.roleTags.join(", ") : ""}
                  />
                </div>
                <label className="flex items-center gap-3 text-sm text-[color:var(--text-muted)]">
                  <input
                    type="checkbox"
                    name="active"
                    defaultChecked={operator.active}
                    className="h-4 w-4"
                  />
                  Active in demo pool
                </label>
                <div className="flex gap-3 md:col-span-2">
                  <SubmitButton pendingLabel="Saving operator...">Save operator</SubmitButton>
                  <Button formAction={deleteOperatorAction} variant="destructive">
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
