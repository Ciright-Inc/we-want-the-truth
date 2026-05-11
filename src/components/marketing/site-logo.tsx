import Link from "next/link";
import { Scale } from "lucide-react";
import { cn } from "@/lib/utils";

/** Icon-only mark for inline branding (e.g. section cards). */
export function SiteLogoMark({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  const box = size === "sm" ? "h-10 w-10 rounded-lg" : "h-12 w-12 rounded-xl";
  const icon = size === "sm" ? "h-5 w-5" : "h-6 w-6";

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center bg-gradient-to-br from-brand to-brand/85 text-brand-foreground shadow-soft-sm ring-1 ring-black/[0.06] dark:ring-white/[0.12]",
        box,
        className
      )}
      aria-hidden
    >
      <Scale className={icon} strokeWidth={1.65} />
    </span>
  );
}

type SiteLogoProps = {
  className?: string;
  /** Larger wordmark for footer */
  size?: "header" | "footer";
};

export function SiteLogo({ className, size = "header" }: SiteLogoProps) {
  const isFooter = size === "footer";

  return (
    <Link
      href="/"
      aria-label="We Want The Truth — Home"
      className={cn(
        "inline-flex max-w-[min(100%,18rem)] items-center gap-3 rounded-lg outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
    >
      <span
        className={cn(
          "relative flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand/85 text-brand-foreground shadow-soft-sm ring-1 ring-black/[0.06] dark:ring-white/[0.12]",
          isFooter ? "h-10 w-10" : "h-9 w-9 sm:h-10 sm:w-10"
        )}
        aria-hidden
      >
        <Scale
          className={cn("text-current", isFooter ? "h-5 w-5" : "h-[18px] w-[18px] sm:h-5 sm:w-5")}
          strokeWidth={1.65}
        />
      </span>
      <span className="min-w-0 text-left leading-tight">
        <span
          className={cn(
            "block font-sans font-semibold uppercase tracking-[0.22em] text-muted-foreground",
            isFooter ? "text-[11px]" : "text-[10px] sm:text-[11px]"
          )}
        >
          We want
        </span>
        <span
          className={cn(
            "mt-0.5 block font-serif font-semibold tracking-tight text-foreground",
            isFooter ? "text-xl" : "text-base sm:text-lg"
          )}
        >
          The Truth
        </span>
      </span>
    </Link>
  );
}
