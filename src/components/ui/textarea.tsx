import * as React from "react";

import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-28 w-full rounded-[16px] border border-[#d5ccbf] bg-[#ffffff] px-4 py-3 text-sm text-[#111315] shadow-none transition-colors placeholder:text-[#7a7f84] focus-visible:border-[#255447] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dce6e1]",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
