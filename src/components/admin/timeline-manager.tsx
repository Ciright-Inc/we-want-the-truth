"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef } from "@tanstack/react-table";
import { FileVisibility } from "@prisma/client";
import { useCallback, useMemo, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";
import { deleteTimelineAction, saveTimelineAction } from "@/server/tenant-admin-actions";
import { timelineInputSchema } from "@/lib/validators/admin";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TimelineSection, type TimelineRow } from "@/components/tenant/timeline-section";

type Row = {
  id: string;
  eventDate: string;
  title: string;
  shortSummary: string | null;
  fullDescription: string;
  category: string | null;
  visibility: FileVisibility;
  featured: boolean;
  videoUrl: string | null;
  audioFileUrl: string | null;
  imageUrls: string[];
};

type FormValues = z.infer<typeof timelineInputSchema>;

export function TimelineManager({ tenantSlug, items }: { tenantSlug: string; items: Row[] }) {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(timelineInputSchema),
    defaultValues: {
      eventDate: new Date().toISOString().slice(0, 16),
      title: "",
      shortSummary: "",
      fullDescription: "",
      category: "",
      visibility: "PUBLIC",
      featured: false,
      videoUrl: "",
      audioFileUrl: "",
      imageUrlsText: "",
    },
  });

  const previewRows: TimelineRow[] = [
    {
      id: "preview",
      eventDate: form.watch("eventDate") || new Date().toISOString(),
      title: form.watch("title") || "Preview title",
      shortSummary: form.watch("shortSummary") || null,
      fullDescription: form.watch("fullDescription") || "Preview description.",
      category: form.watch("category") || null,
      videoUrl: form.watch("videoUrl") || null,
    },
  ];

  function openNew() {
    setEditing(null);
    form.reset({
      id: undefined,
      eventDate: new Date().toISOString().slice(0, 16),
      title: "",
      shortSummary: "",
      fullDescription: "",
      category: "",
      visibility: "PUBLIC",
      featured: false,
      videoUrl: "",
      audioFileUrl: "",
      imageUrlsText: "",
    });
    setOpen(true);
  }

  const openEdit = useCallback(
    (row: Row) => {
      setEditing(row);
      form.reset({
        id: row.id,
        eventDate: row.eventDate.slice(0, 16),
        title: row.title,
        shortSummary: row.shortSummary ?? "",
        fullDescription: row.fullDescription,
        category: row.category ?? "",
        visibility: row.visibility,
        featured: row.featured,
        videoUrl: row.videoUrl ?? "",
        audioFileUrl: row.audioFileUrl ?? "",
        imageUrlsText: row.imageUrls.join("\n"),
      });
      setOpen(true);
    },
    [form]
  );

  function onSubmit(values: FormValues) {
    setFormError(null);
    start(async () => {
      const res = await saveTimelineAction(tenantSlug, values);
      if (res.ok) {
        setOpen(false);
        window.location.reload();
      } else {
        setFormError(res.error);
      }
    });
  }

  const columns = useMemo<ColumnDef<Row>[]>(
    () => [
      { accessorKey: "eventDate", header: "Date", cell: ({ row }) => row.original.eventDate.slice(0, 10) },
      { accessorKey: "title", header: "Title" },
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
                if (confirm("Delete timeline row?")) start(() => void deleteTimelineAction(tenantSlug, row.original.id).then(() => window.location.reload()));
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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" onClick={openNew}>
          Add timeline item
        </Button>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={preview} onChange={(e) => setPreview(e.target.checked)} />
          Live public preview (same card component)
        </label>
      </div>
      <DataTable columns={columns} data={items} />
      {preview && (
        <div className="rounded-sm border border-dashed border-neutral-300 p-4 dark:border-neutral-700">
          <p className="mb-2 text-xs font-semibold uppercase text-neutral-500">Public preview</p>
          <TimelineSection items={previewRows} />
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        {open && (
          <>
            <DialogHeader title={editing ? "Edit timeline" : "New timeline item"} onClose={() => setOpen(false)} />
            <DialogBody>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <div>
                  <Label>Event date / time</Label>
                  <Input type="datetime-local" className="mt-1" {...form.register("eventDate")} />
                  {form.formState.errors.eventDate ? <p className="mt-1 text-xs text-red-700">{form.formState.errors.eventDate.message}</p> : null}
                </div>
                <div>
                  <Label>Title</Label>
                  <Input className="mt-1" {...form.register("title")} />
                  {form.formState.errors.title ? <p className="mt-1 text-xs text-red-700">{form.formState.errors.title.message}</p> : null}
                </div>
                <div>
                  <Label>Short summary</Label>
                  <Textarea rows={3} className="mt-1" {...form.register("shortSummary")} />
                </div>
                <div>
                  <Label>Full description (paragraphs)</Label>
                  <Textarea rows={8} className="mt-1 font-mono text-sm" {...form.register("fullDescription")} />
                  {form.formState.errors.fullDescription ? <p className="mt-1 text-xs text-red-700">{form.formState.errors.fullDescription.message}</p> : null}
                </div>
                <div>
                  <Label>Category</Label>
                  <Input className="mt-1" {...form.register("category")} />
                  {form.formState.errors.category ? <p className="mt-1 text-xs text-red-700">{form.formState.errors.category.message}</p> : null}
                </div>
                <div>
                  <Label>Video URL</Label>
                  <Input className="mt-1" {...form.register("videoUrl")} />
                  {form.formState.errors.videoUrl ? <p className="mt-1 text-xs text-red-700">{form.formState.errors.videoUrl.message}</p> : null}
                </div>
                <div>
                  <Label>Audio file URL</Label>
                  <Input className="mt-1" {...form.register("audioFileUrl")} />
                  {form.formState.errors.audioFileUrl ? <p className="mt-1 text-xs text-red-700">{form.formState.errors.audioFileUrl.message}</p> : null}
                </div>
                <div>
                  <Label>Image URLs (one per line)</Label>
                  <Textarea rows={3} className="mt-1" {...form.register("imageUrlsText")} />
                  {form.formState.errors.imageUrlsText ? <p className="mt-1 text-xs text-red-700">{form.formState.errors.imageUrlsText.message}</p> : null}
                </div>
                <div>
                  <Label>Visibility</Label>
                  <select className="mt-1 flex h-10 w-full rounded-sm border border-neutral-300 bg-white px-2 dark:border-neutral-700 dark:bg-neutral-950" {...form.register("visibility")}>
                    <option value="PUBLIC">PUBLIC</option>
                    <option value="PRIVATE">PRIVATE</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <Controller
                    name="featured"
                    control={form.control}
                    render={({ field }) => (
                      <input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                    )}
                  />
                  Featured
                </label>
                {formError ? <p className="text-sm text-red-700">{formError}</p> : null}
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
