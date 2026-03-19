import * as React from "react";

import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-24 w-full rounded-md border border-[color:var(--border-strong)] bg-[color:var(--surface-0)] px-3 py-2 text-sm text-[color:var(--text-strong)] placeholder:text-[color:var(--text-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-strong)]",
        className,
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";
