import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
  {
    variants: {
      variant: {
        default: "bg-[#ece6de] text-[#17191c]",
        accent: "bg-[#dce6e1] text-[#255447]",
        positive: "bg-[#e3ebe8] text-[#255447]",
        negative: "bg-[#f1ddd6] text-[#4f2d26]",
        outline: "border border-[#d5ccbf] bg-transparent text-[#5f584f]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
