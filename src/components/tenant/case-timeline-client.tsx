"use client";

import { TimelineSection, type TimelineRow } from "@/components/tenant/timeline-section";
import { useVideoPlayLogger } from "@/components/tenant/video-play-logger";

export function CaseTimelineClient({ tenantSlug, items }: { tenantSlug: string; items: TimelineRow[] }) {
  const log = useVideoPlayLogger(tenantSlug);
  return <TimelineSection items={items} onVideoPlay={log} />;
}
