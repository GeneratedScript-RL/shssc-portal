import Link from "next/link";
import type { UserProfile } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface UsersTableProps {
  users: UserProfile[];
}

export default function UsersTable({ users }: UsersTableProps) {
  return (
    <div className="roblox-panel">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Access</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Link href={`/admin/users/${user.id}`} className="font-semibold text-brand-green">
                  {user.full_name}
                </Link>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.access_level?.name ?? "Unassigned"}</TableCell>
              <TableCell>
                <Badge variant={user.is_active ? "default" : "warning"}>
                  {user.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
