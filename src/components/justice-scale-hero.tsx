import { Scale } from "lucide-react";

export function JusticeScaleHero() {
  return (
    <div className="grid items-start gap-10 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-12 xl:gap-16">
      <div className="relative mx-auto flex w-full max-w-[11rem] justify-center lg:mx-0 lg:max-w-none lg:justify-start">
        <div
          aria-hidden
          className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-brand/[0.12] via-transparent to-neutral-200/35 blur-2xl dark:from-brand/15 dark:to-neutral-800/25"
        />
        <div className="flex aspect-square w-full max-w-[10.5rem] items-center justify-center rounded-2xl border border-border/80 bg-card p-8 shadow-soft ring-1 ring-black/[0.04] dark:bg-card dark:ring-white/[0.06] sm:max-w-[12rem] sm:p-10 lg:w-44 lg:shrink-0 xl:w-48">
          <Scale className="h-full max-h-[5.5rem] w-full max-w-[5.5rem] text-foreground/88 sm:max-h-24 sm:max-w-24" strokeWidth={0.85} aria-hidden />
        </div>
      </div>

      <div className="min-w-0 space-y-5 text-center lg:space-y-6 lg:pt-1 lg:text-left">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          Truth needs structure
        </p>
        <h1 className="font-serif text-balance text-4xl font-semibold leading-[1.06] tracking-tight text-foreground sm:text-5xl lg:text-[3.15rem] xl:text-[3.35rem]">
          We Want The Truth
        </h1>
        <p className="mx-auto max-w-2xl text-pretty text-lg leading-relaxed text-neutral-600 dark:text-neutral-400 lg:mx-0 lg:max-w-[42rem]">
          When institutions use delay, cost, and complexity as weapons, We Want The Truth helps people organize the
          record, publish the facts, and let the public review the evidence.
        </p>
      </div>
    </div>
  );
}
