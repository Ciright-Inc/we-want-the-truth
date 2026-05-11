"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef } from "@tanstack/react-table";
import { FileVisibility } from "@prisma/client";
import { useCallback, useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { deleteEvidenceAction, saveEvidenceAction } from "@/server/tenant-admin-actions";
import { evidenceInputSchema } from "@/lib/validators/admin";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Row = {
  id: string;
  title: string;
  exhibitLabel: string | null;
  evidenceDate: string | null;
  evidenceType: string;
  visibility: FileVisibility;
  tags: string[];
  description: string | null;
  evidenceText: string | null;
  chainOfCustodyNotes: string | null;
};

type FormValues = z.infer<typeof evidenceInputSchema>;

export function EvidenceManager({ tenantSlug, rows }: { tenantSlug: string; rows: Row[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [pending, start] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(evidenceInputSchema),
    defaultValues: {
      title: "",
      exhibitLabel: "",
      evidenceDate: "",
      description: "",
      evidenceText: "",
      evidenceType: "other",
      chainOfCustodyNotes: "",
      visibility: "PUBLIC",
      tags: "",
    },
  });

  function openNew() {
    setEditing(null);
    form.reset({
      id: undefined,
      title: "",
      exhibitLabel: "",
      evidenceDate: "",
      description: "",
      evidenceText: "",
      evidenceType: "court filing",
      chainOfCustodyNotes: "",
      visibility: "PUBLIC",
      tags: "",
    });
    setOpen(true);
  }

  const openEdit = useCallback(
    (r: Row) => {
      setEditing(r);
      form.reset({
        id: r.id,
        title: r.title,
        exhibitLabel: r.exhibitLabel ?? "",
        evidenceDate: r.evidenceDate ? r.evidenceDate.slice(0, 10) : "",
        description: r.description ?? "",
        evidenceText: r.evidenceText ?? "",
        evidenceType: r.evidenceType,
        chainOfCustodyNotes: r.chainOfCustodyNotes ?? "",
        visibility: r.visibility,
        tags: r.tags.join(", "),
      });
      setOpen(true);
    },
    [form]
  );

  function onSubmit(values: FormValues) {
    start(async () => {
      const res = await saveEvidenceAction(tenantSlug, values);
      if (res.ok) {
        setOpen(false);
        window.location.reload();
      } else alert(res.error);
    });
  }

  const columns = useMemo<ColumnDef<Row>[]>(
    () => [
      { accessorKey: "title", header: "Title" },
      { accessorKey: "exhibitLabel", header: "Exhibit" },
      { accessorKey: "evidenceType", header: "Type" },
      { accessorKey: "visibility", header: "Vis" },
      {
        id: "a",
        header: "",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button type="button" size="sm" variant="outline" onClick={() => openEdit(row.original)}>
              Edit
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={() => {
                if (confirm("Delete evidence?")) start(() => void deleteEvidenceAction(tenantSlug, row.original.id).then(() => window.location.reload()));
              }}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [tenantSlug, openEdit, start]
  );

  return (
    <div className="space-y-4">
      <Button type="button" onClick={openNew}>
        Add evidence
      </Button>
      <DataTable columns={columns} data={rows} />
      <Dialog open={open} onOpenChange={setOpen}>
        {open && (
          <>
            <DialogHeader title={editing ? "Edit evidence" : "New evidence"} onClose={() => setOpen(false)} />
            <DialogBody>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <div>
                  <Label>Title</Label>
                  <Input className="mt-1" {...form.register("title")} />
                </div>
                <div>
                  <Label>Exhibit label</Label>
                  <Input className="mt-1" {...form.register("exhibitLabel")} />
                </div>
                <div>
                  <Label>Evidence date</Label>
                  <Input type="date" className="mt-1" {...form.register("evidenceDate")} />
                </div>
                <div>
                  <Label>Evidence type</Label>
                  <Input className="mt-1" {...form.register("evidenceType")} />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea rows={3} className="mt-1" {...form.register("description")} />
                </div>
                <div>
                  <Label>Evidence text</Label>
                  <Textarea rows={5} className="mt-1" {...form.register("evidenceText")} />
                </div>
                <div>
                  <Label>Chain of custody</Label>
                  <Textarea rows={2} className="mt-1" {...form.register("chainOfCustodyNotes")} />
                </div>
                <div>
                  <Label>Tags</Label>
                  <Input className="mt-1" {...form.register("tags")} />
                </div>
                <div>
                  <Label>Visibility</Label>
                  <select className="mt-1 flex h-10 w-full rounded-sm border border-neutral-300 bg-white px-2 dark:border-neutral-700 dark:bg-neutral-950" {...form.register("visibility")}>
                    <option value="PUBLIC">PUBLIC</option>
                    <option value="PRIVATE">PRIVATE</option>
                  </select>
                </div>
                <Button type="submit" disabled={pending}>
                  Save
                </Button>
              </form>
            </DialogBody>
          </>
        )}
      </Dialog>
    </div>
  );
}
