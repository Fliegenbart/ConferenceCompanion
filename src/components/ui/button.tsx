"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-[18px] text-sm font-semibold tracking-tight transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dce6e1] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#17191c] text-white shadow-[0_20px_36px_-24px_rgba(17,19,21,0.7)] hover:translate-y-[-1px] hover:bg-[#0f1113] hover:shadow-[0_24px_44px_-28px_rgba(17,19,21,0.8)]",
        secondary: "bg-[#ece6de] text-[#17191c] hover:bg-[#e3ddd5]",
        ghost: "bg-transparent text-[#17191c] hover:bg-[#f0ebe3]",
        outline: "border border-[#d5ccbf] bg-[#fbf8f3] text-[#17191c] hover:bg-[#f0ebe3]",
        destructive: "bg-[#4f2d26] text-white hover:bg-[#3e221d]",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "size-11 rounded-[18px]",
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
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
