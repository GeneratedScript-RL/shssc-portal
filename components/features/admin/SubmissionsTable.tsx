"use client";

import { useState } from "react";
import type { SubmissionRecord } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SubmissionsTableProps {
  submissions: SubmissionRecord[];
}

export default function SubmissionsTable({ submissions: initialSubmissions }: SubmissionsTableProps) {
  const [submissions, setSubmissions] = useState(initialSubmissions);

  async function updateStatus(id: string, status: SubmissionRecord["status"]) {
    const response = await fetch("/api/submissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    if (response.ok) {
      setSubmissions((current) =>
        current.map((submission) =>
          submission.id === id ? { ...submission, status } : submission,
        ),
      );
    }
  }

  return (
    <div className="roblox-panel">
      <Table className="min-w-[44rem]">
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Visibility</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell className="font-semibold text-brand-green">{submission.subject}</TableCell>
              <TableCell>{submission.submission_type}</TableCell>
              <TableCell>
                <Select value={submission.status} onValueChange={(value) => updateStatus(submission.id, value as SubmissionRecord["status"])}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewing">Reviewing</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="dismissed">Dismissed</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Badge variant={submission.is_public ? "default" : "outline"}>
                  {submission.is_public ? "Public tracker" : "Internal only"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
