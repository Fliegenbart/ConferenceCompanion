import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  hint?: string;
}) {
  return (
    <Card className="relative overflow-hidden p-5">
      <div className="absolute inset-x-5 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(17,19,21,0.14),transparent)]" />
      <div className="flex items-center justify-between gap-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6a6256]">{label}</p>
        <div className="rounded-[14px] bg-[#17191c] p-2.5 text-[#f7f3ed] shadow-[0_14px_24px_-20px_rgba(17,19,21,0.9)]">
          <Icon className="size-4" />
        </div>
      </div>
      <div className="mt-6">
        <p className="font-manrope text-[2.75rem] font-semibold leading-none tracking-[-0.07em] text-[#111315]">{value}</p>
        {hint ? <p className="mt-2 text-sm text-[#59616a]">{hint}</p> : null}
      </div>
    </Card>
  );
}
