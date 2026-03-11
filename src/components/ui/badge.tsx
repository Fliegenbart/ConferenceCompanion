import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-[#e5ece2] text-[#284334]",
        accent: "bg-[#f7e1d8] text-[#8a3d26]",
        positive: "bg-[#dcebdd] text-[#285939]",
        negative: "bg-[#f4d9d6] text-[#8f2f20]",
        outline: "border border-[#c8d2c5] bg-transparent text-[#466152]",
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
