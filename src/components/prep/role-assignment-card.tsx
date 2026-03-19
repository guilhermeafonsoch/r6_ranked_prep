import { Users } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { RoleAssignment } from "@/lib/types";

type RoleAssignmentCardProps = {
  assignments: RoleAssignment[];
};

export function RoleAssignmentCard({ assignments }: RoleAssignmentCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-[color:var(--accent-strong)]" />
          Role assignments
        </CardTitle>
        <CardDescription>Scaled to the chosen stack size.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {assignments.map((assignment) => (
          <div
            key={`${assignment.slot}-${assignment.role}`}
            className="rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-0)] p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium">{assignment.role}</p>
              <p className="text-sm text-[color:var(--text-subtle)]">{assignment.operator}</p>
            </div>
            <p className="mt-2 text-sm leading-6 text-[color:var(--text-muted)]">
              {assignment.responsibility}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
