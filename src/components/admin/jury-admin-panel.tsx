"use client";

import { useState, useTransition } from "react";
import { exportJuryVotesCsvAction, updateJurySettingsAction } from "@/server/tenant-admin-actions";
import { Button } from "@/components/ui/button";

export function JuryAdminPanel({
  tenantSlug,
  publicJuryEnabled,
  showAggregateVotes,
}: {
  tenantSlug: string;
  publicJuryEnabled: boolean;
  showAggregateVotes: boolean;
}) {
  const [pj, setPj] = useState(publicJuryEnabled);
  const [sv, setSv] = useState(showAggregateVotes);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  function save() {
    setMsg(null);
    start(async () => {
      const res = await updateJurySettingsAction(tenantSlug, { publicJuryEnabled: pj, showAggregateVotes: sv });
      setMsg(res.ok ? res.message ?? "Saved" : res.error);
    });
  }

  function exportCsv() {
    start(async () => {
      const res = await exportJuryVotesCsvAction(tenantSlug);
      if (!res.ok || !res.csv) {
        setMsg(res.ok ? "No data" : res.error);
        return;
      }
      const blob = new Blob([res.csv], { type: "text/csv" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `jury-votes-${tenantSlug}.csv`;
      a.click();
      URL.revokeObjectURL(a.href);
    });
  }

  return (
    <div className="max-w-xl space-y-4 rounded-sm border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={pj} onChange={(e) => setPj(e.target.checked)} />
        Public jury voting enabled
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={sv} onChange={(e) => setSv(e.target.checked)} />
        Show aggregate vote totals on public site
      </label>
      <p className="text-xs text-neutral-600 dark:text-neutral-400">Fraud controls: votes store hashed IP and optional session id at submission time (see jury API).</p>
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={save} disabled={pending}>
          Save settings
        </Button>
        <Button type="button" variant="outline" onClick={exportCsv} disabled={pending}>
          Export votes CSV
        </Button>
      </div>
      {msg && <p className="text-sm">{msg}</p>}
    </div>
  );
}
