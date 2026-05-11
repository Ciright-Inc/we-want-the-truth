"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { CommentStatus } from "@prisma/client";
import { useMemo, useState, useTransition } from "react";
import { bulkSetCommentStatusAction, setCommentPinnedAction, setCommentStatusAction } from "@/server/tenant-admin-actions";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";

type Row = {
  id: string;
  body: string;
  status: CommentStatus;
  pinned: boolean;
  createdAt: string;
  userEmail: string;
};

const statuses: CommentStatus[] = ["PENDING", "APPROVED", "HIDDEN", "REJECTED"];

export function CommentsModerationTable({ tenantSlug, rows }: { tenantSlug: string; rows: Row[] }) {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [pending, start] = useTransition();

  const selectedIds = Object.entries(selected)
    .filter(([, v]) => v)
    .map(([k]) => k);

  function toggle(id: string) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }

  function bulk(status: CommentStatus) {
    if (!selectedIds.length) return;
    start(async () => {
      await bulkSetCommentStatusAction(tenantSlug, { commentIds: selectedIds, status });
      setSelected({});
      window.location.reload();
    });
  }

  const columns = useMemo<ColumnDef<Row>[]>(
    () => [
      {
        id: "sel",
        header: "",
        cell: ({ row }) => (
          <input type="checkbox" checked={!!selected[row.original.id]} onChange={() => toggle(row.original.id)} aria-label="Select row" />
        ),
      },
      { accessorKey: "createdAt", header: "When", cell: ({ row }) => row.original.createdAt.slice(0, 19) },
      { accessorKey: "userEmail", header: "User" },
      {
        accessorKey: "body",
        header: "Comment",
        cell: ({ row }) => <span className="line-clamp-3 max-w-xs text-xs">{row.original.body}</span>,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <select
            className="h-9 rounded-sm border border-neutral-300 bg-white px-2 text-xs dark:border-neutral-700 dark:bg-neutral-950"
            value={row.original.status}
            onChange={(e) => {
              const v = e.target.value as CommentStatus;
              start(async () => {
                await setCommentStatusAction(tenantSlug, { commentId: row.original.id, status: v });
                window.location.reload();
              });
            }}
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        ),
      },
      {
        id: "pin",
        header: "Pin",
        cell: ({ row }) => (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              start(async () => {
                await setCommentPinnedAction(tenantSlug, row.original.id, !row.original.pinned);
                window.location.reload();
              })
            }
          >
            {row.original.pinned ? "Unpin" : "Pin"}
          </Button>
        ),
      },
    ],
    [tenantSlug, selected]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" disabled={!selectedIds.length || pending} onClick={() => bulk("APPROVED")}>
          Bulk approve
        </Button>
        <Button type="button" variant="outline" size="sm" disabled={!selectedIds.length || pending} onClick={() => bulk("REJECTED")}>
          Bulk reject
        </Button>
        <Button type="button" variant="outline" size="sm" disabled={!selectedIds.length || pending} onClick={() => bulk("HIDDEN")}>
          Bulk hide
        </Button>
      </div>
      <DataTable columns={columns} data={rows} />
    </div>
  );
}
