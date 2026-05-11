"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { upsertSystemSettingAction } from "@/app/super-admin/actions";
import { Button } from "@/components/ui/button";

type Row = { key: string; value: unknown; updatedAt: string };

export function SystemSettingUpsertForm({ initialRows }: { initialRows: Row[] }) {
  const router = useRouter();
  const [key, setKey] = useState("");
  const [valueJson, setValueJson] = useState("{}");
  const [p, start] = useTransition();

  return (
    <form
      className="mt-8 max-w-2xl space-y-4 rounded-sm border border-neutral-200 bg-white p-6 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          const r = await upsertSystemSettingAction({ key: key.trim(), valueJson });
          if (r.ok) {
            setKey("");
            setValueJson("{}");
            router.refresh();
          } else alert(r.error);
        });
      }}
    >
      <h2 className="text-lg font-semibold">Create or update setting</h2>
      <p className="text-xs text-neutral-600">`value` must be valid JSON (object, array, string, number, boolean).</p>
      <div>
        <label className="text-xs font-semibold uppercase text-neutral-500">Key</label>
        <input
          className="mt-1 w-full rounded-sm border border-neutral-300 px-3 py-2 font-mono text-sm"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="e.g. maintenance_banner"
          required
        />
      </div>
      <div>
        <label className="text-xs font-semibold uppercase text-neutral-500">Value (JSON)</label>
        <textarea
          className="mt-1 min-h-[140px] w-full rounded-sm border border-neutral-300 px-3 py-2 font-mono text-sm"
          value={valueJson}
          onChange={(e) => setValueJson(e.target.value)}
          spellCheck={false}
          required
        />
      </div>
      <Button type="submit" disabled={p}>
        {p ? "Saving…" : "Upsert"}
      </Button>
      {initialRows.length > 0 && (
        <p className="text-xs text-neutral-500">Tip: copy an existing row below into the JSON field, edit, and reuse the same key to update.</p>
      )}
    </form>
  );
}
