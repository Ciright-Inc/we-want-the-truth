"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Braces, KeyRound, Sparkles } from "lucide-react";
import { upsertSystemSettingAction } from "@/app/super-admin/actions";
import { Button } from "@/components/ui/button";

type Row = { key: string; value: unknown; updatedAt: string };

export function SystemSettingUpsertForm({ initialRows }: { initialRows: Row[] }) {
  const router = useRouter();
  const [key, setKey] = useState("");
  const [valueJson, setValueJson] = useState("{}");
  const [p, start] = useTransition();
  const [jsonError, setJsonError] = useState<string | null>(null);

  function validateJson(raw: string): string | null {
    try {
      JSON.parse(raw);
      return null;
    } catch (error) {
      return error instanceof Error ? error.message : "Invalid JSON";
    }
  }

  return (
    <form
      className="max-w-3xl space-y-5 rounded-xl border border-neutral-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6"
      onSubmit={(e) => {
        e.preventDefault();
        const nextError = validateJson(valueJson);
        setJsonError(nextError);
        if (nextError) return;
        start(async () => {
          const r = await upsertSystemSettingAction({ key: key.trim(), valueJson });
          if (r.ok) {
            setKey("");
            setValueJson("{}");
            setJsonError(null);
            router.refresh();
          } else alert(r.error);
        });
      }}
    >
      <div className="space-y-2">
        <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-600">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          Configuration editor
        </p>
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-neutral-900">Create or update setting</h2>
        <p className="text-xs leading-relaxed text-neutral-600">
          <code>value</code> must be valid JSON (object, array, string, number, or boolean).
        </p>
      </div>

      <div>
        <label className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          <KeyRound className="h-3.5 w-3.5" aria-hidden />
          Key
        </label>
        <input
          className="mt-1.5 h-11 w-full rounded-lg border border-neutral-300 bg-white px-3 font-mono text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-400"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="e.g. maintenance_banner"
          required
        />
      </div>
      <div>
        <label className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          <Braces className="h-3.5 w-3.5" aria-hidden />
          Value (JSON)
        </label>
        <textarea
          className="mt-1.5 min-h-[170px] w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 font-mono text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-400"
          value={valueJson}
          onChange={(e) => {
            const next = e.target.value;
            setValueJson(next);
            setJsonError(validateJson(next));
          }}
          spellCheck={false}
          required
        />
        {jsonError ? <p className="mt-2 text-xs font-medium text-red-600">Invalid JSON: {jsonError}</p> : null}
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" variant="destructive" className="h-10 px-5 text-sm font-semibold" disabled={p || !!jsonError}>
          {p ? "Saving..." : "Save Setting"}
        </Button>
        <p className="text-xs text-neutral-500">Upsert uses key match: existing key updates, new key inserts.</p>
      </div>

      {initialRows.length > 0 && (
        <p className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs leading-relaxed text-neutral-600">
          Tip: copy an existing row below into the JSON field, edit values, and reuse the same key to update safely.
        </p>
      )}
    </form>
  );
}
