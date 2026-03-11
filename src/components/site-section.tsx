import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";

export function SiteSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card className="space-y-4 p-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-[#173325]">{title}</h2>
        {description ? <p className="text-sm leading-6 text-[#5d7065]">{description}</p> : null}
      </div>
      {children}
    </Card>
  );
}
