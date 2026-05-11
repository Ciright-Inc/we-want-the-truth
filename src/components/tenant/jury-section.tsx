"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { JuryVoteDisclaimer } from "@/components/legal-disclaimer";
import type { JuryPosition } from "@prisma/client";

export function JurySection({
  tenantSlug,
  enabled,
  showTotals,
  totals,
  initialVote,
}: {
  tenantSlug: string;
  enabled: boolean;
  showTotals: boolean;
  totals: { FOR_PLAINTIFF: number; FOR_DEFENDANT: number; UNDECIDED: number };
  initialVote: JuryPosition | null;
}) {
  const { status } = useSession();
  const router = useRouter();
  const [current, setCurrent] = useState<JuryPosition | null>(initialVote);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setCurrent(initialVote);
  }, [initialVote]);

  const totalAll = totals.FOR_PLAINTIFF + totals.FOR_DEFENDANT + totals.UNDECIDED;

  async function submit(position: JuryPosition) {
    if (status !== "authenticated") {
      router.push(`/t/${tenantSlug}/login?callbackUrl=${encodeURIComponent(`/t/${tenantSlug}#jury`)}`);
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/tenants/${tenantSlug}/jury-vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ position }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Vote failed");
      setCurrent(position);
      router.refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  if (!enabled) {
    return (
      <section id="jury" className="scroll-mt-24">
        <h2 className="text-xl font-semibold">Public Jury</h2>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Voting is not enabled for this matter.</p>
      </section>
    );
  }

  return (
    <section id="jury" className="scroll-mt-24 space-y-4">
      <h2 className="text-xl font-semibold">Public Jury</h2>
      <JuryVoteDisclaimer />
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Button
          variant={current === "FOR_PLAINTIFF" ? "success" : "outline"}
          className={current === "FOR_PLAINTIFF" ? "ring-2 ring-emerald-500" : ""}
          disabled={loading}
          onClick={() => submit("FOR_PLAINTIFF")}
        >
          For Plaintiff / Claimant
        </Button>
        <Button
          variant={current === "FOR_DEFENDANT" ? "destructive" : "outline"}
          className={current === "FOR_DEFENDANT" ? "ring-2 ring-red-500" : ""}
          disabled={loading}
          onClick={() => submit("FOR_DEFENDANT")}
        >
          For Defendant / Institution
        </Button>
        <Button
          variant={current === "UNDECIDED" ? "default" : "outline"}
          className={current === "UNDECIDED" ? "bg-neutral-600 text-white" : ""}
          disabled={loading}
          onClick={() => submit("UNDECIDED")}
        >
          Undecided
        </Button>
      </div>
      {message && <p className="text-sm text-red-700">{message}</p>}
      {showTotals && totalAll > 0 && (
        <div className="mt-4 rounded-sm border border-neutral-200 p-4 text-sm dark:border-neutral-800">
          <p className="font-semibold">Aggregate results</p>
          <ul className="mt-2 space-y-1">
            <li className="text-emerald-800 dark:text-emerald-300">
              Plaintiff / claimant: {totals.FOR_PLAINTIFF} ({Math.round((totals.FOR_PLAINTIFF / totalAll) * 100)}%)
            </li>
            <li className="text-red-800 dark:text-red-300">
              Defendant / institution: {totals.FOR_DEFENDANT} ({Math.round((totals.FOR_DEFENDANT / totalAll) * 100)}%)
            </li>
            <li className="text-neutral-600 dark:text-neutral-400">
              Undecided: {totals.UNDECIDED} ({Math.round((totals.UNDECIDED / totalAll) * 100)}%)
            </li>
          </ul>
        </div>
      )}
    </section>
  );
}
