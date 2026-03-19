import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--surface-0)]",
  {
    variants: {
      variant: {
        default:
          "bg-[color:var(--accent-strong)] text-[color:var(--accent-foreground)] hover:bg-[color:var(--accent-soft)]",
        secondary:
          "bg-[color:var(--surface-2)] text-[color:var(--text-strong)] hover:bg-[color:var(--surface-3)]",
        outline:
          "border border-[color:var(--border-strong)] bg-transparent text-[color:var(--text-strong)] hover:bg-[color:var(--surface-1)]",
        ghost:
          "text-[color:var(--text-muted)] hover:bg-[color:var(--surface-1)] hover:text-[color:var(--text-strong)]",
        destructive:
          "bg-[color:var(--danger)] text-white hover:bg-[color:var(--danger-soft)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-6",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
