"use client";

import { useCallback, useRef } from "react";

export function useVideoPlayLogger(tenantSlug: string) {
  const last = useRef(0);
  return useCallback(
    (payload: { timelineItemId: string; videoId: string; secondsWatched: number; completed: boolean }) => {
      const now = Date.now();
      if (now - last.current < 4000 && !payload.completed) return;
      last.current = now;
      void fetch(`/api/tenants/${tenantSlug}/video-play`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {});
    },
    [tenantSlug]
  );
}
