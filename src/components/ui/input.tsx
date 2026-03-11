import * as React from "react";

import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-2xl border border-[#c9d3c6] bg-white px-4 py-2 text-sm text-[#163224] shadow-sm transition-colors placeholder:text-[#809283] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#da4f29]/30",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
