import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { readStringArray } from "@/lib/utils";

type RotationEventCardProps = {
  seasonTag: string;
  effectiveDate: Date;
  addedMaps: unknown;
  removedMaps: unknown;
  notes: string;
};

export function RotationEventCard({
  seasonTag,
  effectiveDate,
  addedMaps,
  removedMaps,
  notes,
}: RotationEventCardProps) {
  return (
    <div className="rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-0)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Badge variant="amber">{seasonTag}</Badge>
        <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--text-subtle)]">
          {format(effectiveDate, "MMM d, yyyy")}
        </p>
      </div>
      <p className="mt-3 text-sm text-[color:var(--text-muted)]">
        Added: {readStringArray(addedMaps).join(", ")} · Removed:{" "}
        {readStringArray(removedMaps).join(", ")}
      </p>
      <p className="mt-2 text-sm leading-6 text-[color:var(--text-muted)]">
        {notes}
      </p>
    </div>
  );
}
