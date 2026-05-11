"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { updateAbuseReportAction, updateLegalNoticeAction } from "@/app/super-admin/actions";
import { Button } from "@/components/ui/button";

export function AbuseRowActions({ id }: { id: string }) {
  const router = useRouter();
  const [p, start] = useTransition();
  return (
    <div className="flex flex-wrap gap-2">
      {["reviewing", "closed", "open"].map((st) => (
        <Button
          key={st}
          type="button"
          size="sm"
          variant="outline"
          disabled={p}
          onClick={() =>
            start(async () => {
              const r = await updateAbuseReportAction({ id, status: st });
              if (r.ok) router.refresh();
              else alert(r.error);
            })
          }
        >
          {st}
        </Button>
      ))}
    </div>
  );
}

export function LegalRowActions({ id }: { id: string }) {
  const router = useRouter();
  const [p, start] = useTransition();
  return (
    <div className="flex flex-wrap gap-2">
      {["queued", "in_review", "closed"].map((st) => (
        <Button
          key={st}
          type="button"
          size="sm"
          variant="outline"
          disabled={p}
          onClick={() =>
            start(async () => {
              const r = await updateLegalNoticeAction({ id, status: st });
              if (r.ok) router.refresh();
              else alert(r.error);
            })
          }
        >
          {st}
        </Button>
      ))}
    </div>
  );
}
