"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Dialog({ open, onOpenChange, children }: { open: boolean; onOpenChange: (o: boolean) => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/60" aria-label="Close dialog" onClick={() => onOpenChange(false)} />
      <div className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-sm border border-neutral-200 bg-white p-6 shadow-xl dark:border-neutral-800 dark:bg-neutral-950">
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4 border-b border-neutral-200 pb-3 dark:border-neutral-800">
      <h2 className="text-lg font-semibold">{title}</h2>
      <button type="button" onClick={onClose} className="rounded-sm p-1 hover:bg-neutral-100 dark:hover:bg-neutral-900">
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

export function DialogBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("prose prose-neutral max-w-none dark:prose-invert", className)} {...props} />;
}
