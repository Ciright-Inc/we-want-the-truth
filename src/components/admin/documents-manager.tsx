"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef } from "@tanstack/react-table";
import { FileVisibility } from "@prisma/client";
import { useCallback, useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { deleteDocumentAction, saveDocumentAction } from "@/server/tenant-admin-actions";
import { documentInputSchema } from "@/lib/validators/admin";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type DocRow = {
  id: string;
  title: string;
  documentDate: string | null;
  filingType: string | null;
  visibility: FileVisibility;
  tags: string[];
  fileAssetId: string | null;
  description: string | null;
  source: string | null;
};

type FormValues = z.infer<typeof documentInputSchema>;

export function DocumentsManager({ tenantSlug, documents }: { tenantSlug: string; documents: DocRow[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DocRow | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(documentInputSchema),
    defaultValues: {
      title: "",
      documentDate: "",
      filingType: "",
      description: "",
      source: "",
      visibility: "PUBLIC",
      tags: "",
      fileAssetId: null,
    },
  });

  function openNew() {
    setEditing(null);
    form.reset({
      id: undefined,
      title: "",
      documentDate: "",
      filingType: "",
      description: "",
      source: "",
      visibility: "PUBLIC",
      tags: "",
      fileAssetId: null,
    });
    setOpen(true);
  }

  const openEdit = useCallback(
    (row: DocRow) => {
      setEditing(row);
      form.reset({
        id: row.id,
        title: row.title,
        documentDate: row.documentDate ? row.documentDate.slice(0, 10) : "",
        filingType: row.filingType ?? "",
        description: row.description ?? "",
        source: row.source ?? "",
        visibility: row.visibility,
        tags: row.tags.join(", "),
        fileAssetId: row.fileAssetId,
      });
      setOpen(true);
    },
    [form]
  );

  const onDelete = useCallback(
    (id: string) => {
      if (!confirm("Soft-delete this document?")) return;
      start(async () => {
        await deleteDocumentAction(tenantSlug, id);
        window.location.reload();
      });
    },
    [tenantSlug, start]
  );

  function onSubmit(values: FormValues) {
    setMsg(null);
    start(async () => {
      const res = await saveDocumentAction(tenantSlug, values);
      setMsg(res.ok ? res.message ?? "Saved" : res.error);
      if (res.ok) {
        setOpen(false);
        window.location.reload();
      }
    });
  }

  const columns = useMemo<ColumnDef<DocRow>[]>(
    () => [
      { accessorKey: "title", header: "Title" },
      {
        accessorKey: "documentDate",
        header: "Date",
        cell: ({ row }) => (row.original.documentDate ? row.original.documentDate.slice(0, 10) : "—"),
      },
      { accessorKey: "visibility", header: "Visibility" },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="outline" onClick={() => openEdit(row.original)}>
              Edit
            </Button>
            <Button type="button" size="sm" variant="destructive" onClick={() => onDelete(row.original.id)}>
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [openEdit, onDelete]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">Upload files via presigned URL, then paste File asset ID here if needed.</p>
        <Button type="button" onClick={openNew}>
          Add document
        </Button>
      </div>
      <DataTable columns={columns} data={documents} />
      {msg && <p className="text-sm text-neutral-700 dark:text-neutral-300">{msg}</p>}

      <Dialog open={open} onOpenChange={setOpen}>
        {open && (
          <>
            <DialogHeader title={editing ? "Edit document" : "New document"} onClose={() => setOpen(false)} />
            <DialogBody>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <div>
                  <Label>Title</Label>
                  <Input className="mt-1" {...form.register("title")} />
                </div>
                <div>
                  <Label>Document date</Label>
                  <Input type="date" className="mt-1" {...form.register("documentDate")} />
                </div>
                <div>
                  <Label>Filing type</Label>
                  <Input className="mt-1" {...form.register("filingType")} />
                </div>
                <div>
                  <Label>Source</Label>
                  <Input className="mt-1" {...form.register("source")} />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea rows={4} className="mt-1" {...form.register("description")} />
                </div>
                <div>
                  <Label>Tags (comma-separated)</Label>
                  <Input className="mt-1" {...form.register("tags")} />
                </div>
                <div>
                  <Label>Visibility</Label>
                  <select className="mt-1 flex h-10 w-full rounded-sm border border-neutral-300 bg-white px-2 dark:border-neutral-700 dark:bg-neutral-950" {...form.register("visibility")}>
                    <option value="PUBLIC">PUBLIC</option>
                    <option value="PRIVATE">PRIVATE</option>
                  </select>
                </div>
                <div>
                  <Label>File asset ID (after S3 upload)</Label>
                  <Input className="mt-1 font-mono text-xs" placeholder="cuid…" {...form.register("fileAssetId")} />
                </div>
                <Button type="submit" disabled={pending}>
                  {pending ? "Saving…" : "Save"}
                </Button>
              </form>
            </DialogBody>
          </>
        )}
      </Dialog>
    </div>
  );
}
