import * as React from "react";
import { cn } from "@/lib/utils";

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({ className, ...props }, ref) => (
  <input
    type="checkbox"
    ref={ref}
    className={cn("h-4 w-4 rounded border-neutral-300 text-black focus:ring-black dark:border-neutral-600 dark:bg-neutral-950", className)}
    {...props}
  />
));
Checkbox.displayName = "Checkbox";
