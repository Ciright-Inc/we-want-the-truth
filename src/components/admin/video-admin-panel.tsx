"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState, useTransition } from "react";
import { createVideoAssetAction } from "@/server/tenant-admin-actions";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AssetRow = { id: string; title: string; embedUrl: string | null; createdAt: string };

export function VideoAdminPanel({
  tenantSlug,
  stats,
  assets,
}: {
  tenantSlug: string;
  stats: { totalPlays: number; uniqueLoggedIn: number; uniqueAnonymous: number; completions: number };
  assets: AssetRow[];
}) {
  const [title, setTitle] = useState("");
  const [embed, setEmbed] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function add() {
    setMsg(null);
    start(async () => {
      const res = await createVideoAssetAction(tenantSlug, title, embed);
      setMsg(res.ok ? res.message ?? "OK" : res.error);
      if (res.ok) {
        setTitle("");
        setEmbed("");
        window.location.reload();
      }
    });
  }

  const columns = useMemo<ColumnDef<AssetRow>[]>(
    () => [
      { accessorKey: "title", header: "Title" },
      { accessorKey: "embedUrl", header: "Embed URL", cell: ({ row }) => row.original.embedUrl ?? "—" },
      { accessorKey: "createdAt", header: "Created", cell: ({ row }) => row.original.createdAt.slice(0, 10) },
    ],
    []
  );

  const completionRate = stats.totalPlays > 0 ? Math.round((stats.completions / stats.totalPlays) * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-sm border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
          <p className="text-xs font-semibold uppercase text-neutral-500">Total video plays</p>
          <p className="mt-1 text-2xl font-bold">{stats.totalPlays}</p>
        </div>
        <div className="rounded-sm border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
          <p className="text-xs font-semibold uppercase text-neutral-500">Unique logged-in viewers</p>
          <p className="mt-1 text-2xl font-bold">{stats.uniqueLoggedIn}</p>
        </div>
        <div className="rounded-sm border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
          <p className="text-xs font-semibold uppercase text-neutral-500">Unique anonymous sessions</p>
          <p className="mt-1 text-2xl font-bold">{stats.uniqueAnonymous}</p>
        </div>
        <div className="rounded-sm border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
          <p className="text-xs font-semibold uppercase text-neutral-500">Completion rate</p>
          <p className="mt-1 text-2xl font-bold">{completionRate}%</p>
        </div>
      </div>

      <div className="max-w-md space-y-3 rounded-sm border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
        <h2 className="text-lg font-semibold">Add video / embed record</h2>
        <div>
          <Label>Title</Label>
          <Input className="mt-1" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <Label>Embed URL (optional)</Label>
          <Input className="mt-1" value={embed} onChange={(e) => setEmbed(e.target.value)} placeholder="https://…" />
        </div>
        <Button type="button" onClick={add} disabled={pending}>
          Create record
        </Button>
        {msg && <p className="text-sm">{msg}</p>}
      </div>

      <div>
        <h2 className="mb-2 text-lg font-semibold">Video assets</h2>
        <DataTable columns={columns} data={assets} />
      </div>
    </div>
  );
}
