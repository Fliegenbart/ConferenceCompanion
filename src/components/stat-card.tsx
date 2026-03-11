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
    <Card className="space-y-4 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#688073]">{label}</p>
        <div className="rounded-2xl bg-[#e7eee2] p-2 text-[#395642]">
          <Icon className="size-4" />
        </div>
      </div>
      <div>
        <p className="text-3xl font-semibold text-[#173325]">{value}</p>
        {hint ? <p className="mt-1 text-sm text-[#688073]">{hint}</p> : null}
      </div>
    </Card>
  );
}
