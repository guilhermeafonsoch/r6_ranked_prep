import { StickyNote } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type SquadNotesPanelProps = {
  notes: {
    id: string;
    title: string;
    body: string;
    user: { displayName: string };
    squad: { name: string } | null;
  }[];
};

export function SquadNotesPanel({ notes }: SquadNotesPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <StickyNote className="h-5 w-5 text-[color:var(--accent-strong)]" />
          Saved squad notes
        </CardTitle>
        <CardDescription>Quick reminders tied to this map and site.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {notes.length ? (
          notes.map((note) => (
            <div
              key={note.id}
              className="rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-0)] p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{note.title}</p>
                {note.squad ? <Badge variant="outline">{note.squad.name}</Badge> : null}
              </div>
              <p className="mt-2 text-sm leading-6 text-[color:var(--text-muted)]">
                {note.body}
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.12em] text-[color:var(--text-subtle)]">
                {note.user.displayName}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-[color:var(--text-subtle)]">
            No squad notes saved for this exact setup yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
