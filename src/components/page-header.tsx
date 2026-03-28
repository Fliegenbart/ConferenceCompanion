import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl space-y-4">
        {eyebrow ? <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6a6256]">{eyebrow}</p> : null}
        <div className="space-y-3">
          <h1 className="max-w-[14ch] font-manrope text-4xl font-semibold leading-[0.94] tracking-[-0.06em] text-[#111315] md:text-[3.4rem]">
            {title}
          </h1>
          {description ? <p className="max-w-xl text-sm leading-6 text-[#59616a] md:text-base">{description}</p> : null}
        </div>
      </div>
      {actions ? (
        <div className="flex flex-wrap gap-3 md:justify-end md:rounded-[18px] md:border md:border-[#ddd6cb] md:bg-white/88 md:p-2 md:shadow-[0_18px_34px_-30px_rgba(17,19,21,0.22)]">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
