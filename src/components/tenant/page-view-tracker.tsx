"use client";

import { useEffect, useRef } from "react";

export function PageViewTracker({ tenantSlug }: { tenantSlug: string }) {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    void fetch(`/api/tenants/${tenantSlug}/page-view`, { method: "POST" }).catch(() => {});
  }, [tenantSlug]);
  return null;
}
