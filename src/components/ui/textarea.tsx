import * as React from "react";

import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-28 w-full rounded-3xl border border-[#c9d3c6] bg-white px-4 py-3 text-sm text-[#163224] shadow-sm transition-colors placeholder:text-[#809283] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#da4f29]/30",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
