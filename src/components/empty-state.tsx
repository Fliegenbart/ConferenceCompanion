import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <Card className="border-dashed border-[#d5ccbf] bg-[#f7f3ed]">
      <CardHeader>
        <div className="mb-4 flex size-12 items-center justify-center rounded-[16px] border border-[#d5ccbf] bg-[#ffffff] text-[#255447]">
          <Icon className="size-5" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent />
    </Card>
  );
}
