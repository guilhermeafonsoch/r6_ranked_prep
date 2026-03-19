import * as React from "react";

import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-md border border-[color:var(--border-strong)] bg-[color:var(--surface-0)] px-3 py-2 text-sm text-[color:var(--text-strong)] placeholder:text-[color:var(--text-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-strong)]",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
