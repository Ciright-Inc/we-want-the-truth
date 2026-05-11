"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PartyRole } from "@prisma/client";
import { useFieldArray, useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { saveCaseSettingsAction } from "@/server/tenant-admin-actions";
import { caseSettingsSchema } from "@/lib/validators/admin";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FormValues = z.infer<typeof caseSettingsSchema>;

const partyRoles: PartyRole[] = ["PLAINTIFF", "DEFENDANT", "COUNSEL", "OTHER"];

export function CaseSettingsForm({
  tenantSlug,
  defaultValues,
}: {
  tenantSlug: string;
  defaultValues: FormValues;
}) {
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const form = useForm<FormValues>({
    resolver: zodResolver(caseSettingsSchema),
    defaultValues,
  });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "parties" });

  function onSubmit(values: FormValues) {
    setMsg(null);
    start(async () => {
      const res = await saveCaseSettingsAction(tenantSlug, values);
      setMsg(res.ok ? res.message ?? "Saved" : res.error);
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto max-w-4xl space-y-8">
      <section className="space-y-4 rounded-sm border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
        <h2 className="text-lg font-semibold">Case identity</h2>
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" className="mt-1" {...form.register("title")} />
          {form.formState.errors.title && <p className="mt-1 text-xs text-red-700">{form.formState.errors.title.message}</p>}
        </div>
        <div>
          <Label htmlFor="caseSummary">Case summary (paragraphs: blank line between paragraphs)</Label>
          <Textarea id="caseSummary" rows={10} className="mt-1 font-mono text-sm" {...form.register("caseSummary")} />
          {form.formState.errors.caseSummary && <p className="mt-1 text-xs text-red-700">{form.formState.errors.caseSummary.message}</p>}
        </div>
        <div>
          <Label htmlFor="heroStatement">Hero / warning statement</Label>
          <Textarea id="heroStatement" rows={3} className="mt-1" {...form.register("heroStatement")} />
          {form.formState.errors.heroStatement && <p className="mt-1 text-xs text-red-700">{form.formState.errors.heroStatement.message}</p>}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="category">Category</Label>
            <Input id="category" className="mt-1" {...form.register("category")} />
            {form.formState.errors.category && <p className="mt-1 text-xs text-red-700">{form.formState.errors.category.message}</p>}
          </div>
          <div>
            <Label htmlFor="themePreference">Theme</Label>
            <select
              id="themePreference"
              className="mt-1 flex h-10 w-full rounded-sm border border-neutral-300 bg-white px-3 text-sm dark:border-neutral-700 dark:bg-neutral-950"
              {...form.register("themePreference")}
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="jurisdiction">Jurisdiction</Label>
            <Input id="jurisdiction" className="mt-1" {...form.register("jurisdiction")} />
            {form.formState.errors.jurisdiction && <p className="mt-1 text-xs text-red-700">{form.formState.errors.jurisdiction.message}</p>}
          </div>
          <div>
            <Label htmlFor="courtOrForum">Court or forum</Label>
            <Input id="courtOrForum" className="mt-1" {...form.register("courtOrForum")} />
            {form.formState.errors.courtOrForum && <p className="mt-1 text-xs text-red-700">{form.formState.errors.courtOrForum.message}</p>}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="matterNumber">Matter number</Label>
            <Input id="matterNumber" className="mt-1" {...form.register("matterNumber")} />
            {form.formState.errors.matterNumber && <p className="mt-1 text-xs text-red-700">{form.formState.errors.matterNumber.message}</p>}
          </div>
          <div>
            <Label htmlFor="statusLabel">Status label</Label>
            <Input id="statusLabel" className="mt-1" {...form.register("statusLabel")} />
            {form.formState.errors.statusLabel && <p className="mt-1 text-xs text-red-700">{form.formState.errors.statusLabel.message}</p>}
          </div>
        </div>
        <div>
          <Label htmlFor="logoUrl">Logo URL</Label>
          <Input id="logoUrl" className="mt-1" {...form.register("logoUrl")} />
          {form.formState.errors.logoUrl && <p className="mt-1 text-xs text-red-700">{form.formState.errors.logoUrl.message}</p>}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="plaintiffLabel">Plaintiff label</Label>
            <Input id="plaintiffLabel" className="mt-1" {...form.register("plaintiffLabel")} />
            {form.formState.errors.plaintiffLabel && <p className="mt-1 text-xs text-red-700">{form.formState.errors.plaintiffLabel.message}</p>}
          </div>
          <div>
            <Label htmlFor="defendantLabel">Defendant label</Label>
            <Input id="defendantLabel" className="mt-1" {...form.register("defendantLabel")} />
            {form.formState.errors.defendantLabel && <p className="mt-1 text-xs text-red-700">{form.formState.errors.defendantLabel.message}</p>}
          </div>
        </div>
        <div>
          <Label htmlFor="counselNotes">Counsel notes</Label>
          <Textarea id="counselNotes" rows={4} className="mt-1" {...form.register("counselNotes")} />
          {form.formState.errors.counselNotes && <p className="mt-1 text-xs text-red-700">{form.formState.errors.counselNotes.message}</p>}
        </div>
      </section>

      <section className="space-y-4 rounded-sm border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
        <h2 className="text-lg font-semibold">Visibility & engagement</h2>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="h-4 w-4 rounded border-neutral-300" {...form.register("isPublicCase")} />
          Public case page enabled
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="h-4 w-4 rounded border-neutral-300" {...form.register("allowAnonymousBrowsing")} />
          Allow anonymous browsing
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="h-4 w-4 rounded border-neutral-300" {...form.register("publicJuryEnabled")} />
          Public jury voting enabled
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="h-4 w-4 rounded border-neutral-300" {...form.register("showAggregateVotes")} />
          Show aggregate vote totals
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="h-4 w-4 rounded border-neutral-300" {...form.register("commentModerationDefault")} />
          New comments require moderation by default
        </label>
      </section>

      <section className="space-y-4 rounded-sm border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Parties</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ role: "OTHER", name: "", description: "", sortOrder: fields.length })}
          >
            Add party
          </Button>
        </div>
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-2 rounded-sm border border-neutral-100 p-4 dark:border-neutral-800">
            <div className="flex flex-wrap items-end gap-2">
              <div>
                <Label>Role</Label>
                <select
                  className="mt-1 flex h-10 rounded-sm border border-neutral-300 bg-white px-2 text-sm dark:border-neutral-700 dark:bg-neutral-950"
                  {...form.register(`parties.${index}.role`)}
                >
                  {partyRoles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div className="min-w-[200px] flex-1">
                <Label>Name</Label>
                <Input className="mt-1" {...form.register(`parties.${index}.name`)} />
                {form.formState.errors.parties?.[index]?.name && <p className="mt-1 text-xs text-red-700">{form.formState.errors.parties[index]?.name?.message}</p>}
              </div>
              <div>
                <Label>Order</Label>
                <Input type="number" className="mt-1 w-20" {...form.register(`parties.${index}.sortOrder`, { valueAsNumber: true })} />
                {form.formState.errors.parties?.[index]?.sortOrder && <p className="mt-1 text-xs text-red-700">{form.formState.errors.parties[index]?.sortOrder?.message}</p>}
              </div>
              <Button type="button" variant="ghost" size="sm" className="text-red-700" onClick={() => remove(index)} disabled={fields.length <= 1}>
                Remove
              </Button>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea rows={3} className="mt-1" {...form.register(`parties.${index}.description`)} />
              {form.formState.errors.parties?.[index]?.description && <p className="mt-1 text-xs text-red-700">{form.formState.errors.parties[index]?.description?.message}</p>}
            </div>
          </div>
        ))}
      </section>

      {msg && <p className="text-sm text-neutral-700 dark:text-neutral-300">{msg}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save all case settings"}
      </Button>
    </form>
  );
}
