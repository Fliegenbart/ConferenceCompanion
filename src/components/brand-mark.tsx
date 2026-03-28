import { cn } from "@/lib/utils";

export function BrandMark({ tone = "default" }: { tone?: "default" | "inverse" }) {
  return (
    <div className="inline-flex items-center gap-3">
      <div
        className={cn(
          "grid size-11 place-items-center rounded-[14px] text-sm font-bold shadow-[0_18px_28px_-22px_rgba(17,19,21,0.65)]",
          tone === "default" ? "bg-[#17191c] text-white" : "border border-white/15 bg-white/10 text-white",
        )}
      >
        CC
      </div>
      <div className="leading-tight">
        <p className={cn("text-[11px] font-semibold uppercase tracking-[0.24em]", tone === "default" ? "text-[#6a6256]" : "text-[#d8d2ca]")}>
          ConferenceCompanion
        </p>
        <p className={cn("text-sm", tone === "default" ? "text-[#111315]" : "text-[#f5f1ea]")}>von Tyrn.ON</p>
      </div>
    </div>
  );
}
