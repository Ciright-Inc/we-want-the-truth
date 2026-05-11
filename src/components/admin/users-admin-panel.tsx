"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState, useTransition } from "react";
import { createTenantEditorAction, updateTenantUserAction } from "@/server/tenant-admin-actions";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Row = { id: string; email: string; name: string | null; role: string; disabled: boolean };

export function UsersAdminPanel({ tenantSlug, users }: { tenantSlug: string; users: Row[] }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteMsg, setInviteMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function invite() {
    setInviteMsg(null);
    start(async () => {
      const res = await createTenantEditorAction(tenantSlug, email, password);
      setInviteMsg(res.ok ? res.message ?? "OK" : res.error);
      if (res.ok) {
        setEmail("");
        setPassword("");
        window.location.reload();
      }
    });
  }

  const columns = useMemo<ColumnDef<Row>[]>(
    () => [
      { accessorKey: "email", header: "Email" },
      { accessorKey: "name", header: "Name" },
      { accessorKey: "role", header: "Role" },
      {
        accessorKey: "disabled",
        header: "Disabled",
        cell: ({ row }) => (row.original.disabled ? "yes" : "no"),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <UserRowActions tenantSlug={tenantSlug} user={row.original} />
        ),
      },
    ],
    [tenantSlug]
  );

  return (
    <div className="space-y-8">
      <div className="max-w-md space-y-3 rounded-sm border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
        <h2 className="text-lg font-semibold">Invite tenant editor</h2>
        <div>
          <Label>Email</Label>
          <Input className="mt-1" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <Label>Initial password (min 10)</Label>
          <Input type="password" className="mt-1" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="button" onClick={invite} disabled={pending}>
          Create editor
        </Button>
        {inviteMsg && <p className="text-sm">{inviteMsg}</p>}
      </div>
      <DataTable columns={columns} data={users} />
    </div>
  );
}

function UserRowActions({ tenantSlug, user }: { tenantSlug: string; user: Row }) {
  const [role, setRole] = useState(user.role);
  const [disabled, setDisabled] = useState(user.disabled);
  const [pending, start] = useTransition();

  function save() {
    start(async () => {
      const res = await updateTenantUserAction(tenantSlug, {
        userId: user.id,
        role: role as "PUBLIC_USER" | "TENANT_EDITOR" | "TENANT_ADMIN",
        disabled,
      });
      if (!res.ok) alert(res.error);
      else window.location.reload();
    });
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <select className="h-9 rounded-sm border border-neutral-300 bg-white px-2 text-xs dark:border-neutral-700 dark:bg-neutral-950" value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="PUBLIC_USER">PUBLIC_USER</option>
        <option value="TENANT_EDITOR">TENANT_EDITOR</option>
        <option value="TENANT_ADMIN">TENANT_ADMIN</option>
      </select>
      <label className="flex items-center gap-1 text-xs">
        <input type="checkbox" checked={disabled} onChange={(e) => setDisabled(e.target.checked)} />
        Disabled
      </label>
      <Button type="button" size="sm" onClick={save} disabled={pending}>
        Save
      </Button>
    </div>
  );
}
