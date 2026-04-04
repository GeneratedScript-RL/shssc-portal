"use client";

import { useState } from "react";
import type { Permission } from "@/lib/rbac/permissions";
import { ADMIN_PERMISSION_LABELS } from "@/lib/rbac/permissions";
import type { Tables } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface PermissionsGridProps {
  levels: Tables<"access_levels">[];
  permissions: Permission[];
  currentAssignments: Record<string, Record<string, boolean>>;
}

export default function PermissionsGrid({
  levels,
  permissions,
  currentAssignments,
}: PermissionsGridProps) {
  const [assignments, setAssignments] = useState(currentAssignments);

  async function toggle(accessLevelId: string, permission: Permission, granted: boolean) {
    const previous = assignments;
    setAssignments((current) => ({
      ...current,
      [accessLevelId]: {
        ...(current[accessLevelId] ?? {}),
        [permission]: granted,
      },
    }));

    const response = await fetch(`/api/access-levels/${accessLevelId}/permissions`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ permission, granted }),
    });

    if (!response.ok) {
      setAssignments(previous);
    }
  }

  return (
    <div className="roblox-panel">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Access Level</TableHead>
            {permissions.map((permission) => (
              <TableHead key={permission}>{ADMIN_PERMISSION_LABELS[permission]}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {levels.map((level) => (
            <TableRow key={level.id}>
              <TableCell className="font-semibold text-brand-green">{level.name}</TableCell>
              {permissions.map((permission) => (
                <TableCell key={`${level.id}-${permission}`}>
                  <Checkbox
                    checked={!!assignments[level.id]?.[permission]}
                    onCheckedChange={(value) => toggle(level.id, permission, !!value)}
                    aria-label={`${level.name} ${permission}`}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
