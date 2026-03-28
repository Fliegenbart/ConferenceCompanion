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
    <Card className="space-y-5 p-6">
      <div className="space-y-2">
        <h2 className="font-manrope text-2xl font-semibold tracking-[-0.04em] text-[#111315]">{title}</h2>
        {description ? <p className="max-w-xl text-sm leading-6 text-[#59616a]">{description}</p> : null}
      </div>
      {children}
    </Card>
  );
}
