"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Session } from "next-auth";
import { CalendarDays, MapPinned } from "lucide-react";

import { attendeeNavigation } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function AttendeeNavigation({ session, mobile = false }: { session: Session; mobile?: boolean }) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "rounded-[22px] border border-[#d5ccbf]/80 bg-[#ffffff]/95 p-4 shadow-[0_18px_28px_-24px_rgba(17,19,21,0.25)]",
        mobile && "sticky bottom-4 border-[#d5ccbf]/70 bg-[#ffffff] p-0 shadow-[0_18px_28px_-24px_rgba(17,19,21,0.25)]",
      )}
    >
      <div className={cn("mb-6 space-y-1 px-2", mobile && "hidden")}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#6a6256]">Teilnehmerbereich</p>
        <h2 className="font-manrope text-xl font-semibold tracking-[-0.04em] text-[#111315]">{session.user.name ?? "Gast"}</h2>
        <p className="text-sm leading-6 text-[#59616a]">Agenda, Anreise und Hinweise.</p>
      </div>
      <div
        className={cn(
          "flex flex-col gap-2",
          mobile && "grid grid-cols-4 rounded-[18px] border border-[#d5ccbf] bg-[#ffffff] p-2 shadow-[0_18px_28px_-24px_rgba(17,19,21,0.25)]",
        )}
      >
        {attendeeNavigation.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-[16px] px-4 py-3 text-sm font-medium text-[#5f584f] transition-all hover:bg-[#f0ebe3] hover:text-[#111315]",
                active &&
                  "bg-[#17191c] text-white shadow-[0_20px_36px_-24px_rgba(17,19,21,0.65)] hover:bg-[#17191c] hover:text-white",
                mobile && "flex-col gap-2 px-2 py-3 text-[11px] text-center",
              )}
            >
              <Icon className={cn("size-4", mobile && "size-4")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
      {!mobile ? (
        <div className="mt-6 rounded-[18px] border border-[#d5ccbf] bg-[#f0ebe3] p-4 text-[#111315]">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <CalendarDays className="size-4" />
            Auf einen Blick
          </div>
          <ul className="space-y-2 text-sm text-[#59616a]">
            <li>14.-15. Mai 2026</li>
            <li>Dortmund Kongresszentrum</li>
            <li>QR-Einlass vor Ort</li>
          </ul>
          <div className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#255447]">
            <MapPinned className="size-3.5" />
            Persönliche Einladung
          </div>
        </div>
      ) : null}
    </nav>
  );
}
