import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]",
  {
    variants: {
      variant: {
        default:
          "border-[color:var(--accent-soft)] bg-[color:var(--accent-soft)]/15 text-[color:var(--accent-strong)]",
        outline:
          "border-[color:var(--border-strong)] bg-transparent text-[color:var(--text-muted)]",
        amber:
          "border-amber-500/20 bg-amber-500/10 text-amber-200",
        green:
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-200",
        danger: "border-rose-500/20 bg-rose-500/10 text-rose-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
