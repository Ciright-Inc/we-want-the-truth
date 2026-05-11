"use client";

import * as React from "react";
import { Maximize2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogBody, DialogHeader } from "@/components/ui/dialog";

export type TimelineRow = {
  id: string;
  eventDate: string;
  title: string;
  shortSummary: string | null;
  fullDescription: string;
  category: string | null;
  videoUrl: string | null;
};

function ParagraphText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/\n\s*\n/).filter(Boolean);
  return (
    <div className={className}>
      {parts.map((p, i) => (
        <p key={i} className="mb-3 last:mb-0 whitespace-pre-wrap">
          {p}
        </p>
      ))}
    </div>
  );
}

function TimelineCardBody({ item, expanded, onToggle }: { item: TimelineRow; expanded: boolean; onToggle: () => void }) {
  const text = item.shortSummary || item.fullDescription;
  return (
    <div>
      <div className={`text-sm text-neutral-800 dark:text-neutral-200 ${expanded ? "" : "line-clamp-5"}`}>
        <ParagraphText text={text} />
      </div>
      {!expanded && (
        <button type="button" onClick={onToggle} className="mt-2 text-xs font-semibold text-red-700 hover:underline dark:text-red-400">
          Expand
        </button>
      )}
      {expanded && (
        <button type="button" onClick={onToggle} className="mt-2 text-xs font-semibold text-neutral-600 hover:underline">
          Collapse
        </button>
      )}
    </div>
  );
}

export function TimelineSection({
  items,
  onVideoPlay,
}: {
  items: TimelineRow[];
  tenantSlug?: string;
  onVideoPlay?: (payload: { timelineItemId: string; videoId: string; secondsWatched: number; completed: boolean }) => void;
}) {
  const [modal, setModal] = React.useState<TimelineRow | null>(null);
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});

  return (
    <section id="timeline" className="scroll-mt-24 space-y-4">
      <h2 className="text-xl font-semibold">Timeline</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2 space-y-0">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{new Date(item.eventDate).toLocaleDateString()}</p>
                <CardTitle className="mt-1 text-base">{item.title}</CardTitle>
                {item.category && <p className="mt-1 text-xs text-neutral-500">{item.category}</p>}
              </div>
              <div className="flex items-center gap-2">
                {item.videoUrl && (
                  <span className="inline-flex items-center gap-1 rounded-sm border border-neutral-200 px-2 py-1 text-xs font-medium dark:border-neutral-700">
                    <Play className="h-3.5 w-3.5" aria-hidden />
                    Video
                  </span>
                )}
                <Button type="button" variant="outline" size="sm" onClick={() => setModal(item)} aria-label="View full window">
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <TimelineCardBody item={item} expanded={!!expanded[item.id]} onToggle={() => setExpanded((e) => ({ ...e, [item.id]: !e[item.id] }))} />
              {item.videoUrl && (
                <div className="mt-4">
                  <video
                    controls
                    className="w-full max-w-lg rounded-sm border border-neutral-200 dark:border-neutral-800"
                    src={item.videoUrl}
                    onTimeUpdate={(ev) => {
                      const v = ev.currentTarget;
                      onVideoPlay?.({
                        timelineItemId: item.id,
                        videoId: item.videoUrl!,
                        secondsWatched: Math.floor(v.currentTime),
                        completed: v.currentTime > 0 && v.duration > 0 && v.currentTime / v.duration > 0.95,
                      });
                    }}
                    onEnded={() =>
                      onVideoPlay?.({
                        timelineItemId: item.id,
                        videoId: item.videoUrl!,
                        secondsWatched: 0,
                        completed: true,
                      })
                    }
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!modal} onOpenChange={(o) => !o && setModal(null)}>
        {modal && (
          <>
            <DialogHeader title={modal.title} onClose={() => setModal(null)} />
            <DialogBody>
              <p className="text-sm text-neutral-500">{new Date(modal.eventDate).toLocaleString()}</p>
              <div className="mt-4">
                <ParagraphText text={modal.fullDescription} />
              </div>
              {modal.videoUrl && (
                <video
                  controls
                  className="mt-6 w-full rounded-sm border border-neutral-200 dark:border-neutral-800"
                  src={modal.videoUrl}
                  onTimeUpdate={(ev) => {
                    const v = ev.currentTarget;
                    onVideoPlay?.({
                      timelineItemId: modal.id,
                      videoId: modal.videoUrl!,
                      secondsWatched: Math.floor(v.currentTime),
                      completed: v.duration > 0 && v.currentTime / v.duration > 0.95,
                    });
                  }}
                />
              )}
            </DialogBody>
          </>
        )}
      </Dialog>
    </section>
  );
}
