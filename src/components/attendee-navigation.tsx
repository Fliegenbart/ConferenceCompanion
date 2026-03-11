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
        "rounded-[32px] border border-[#d7e0d3] bg-[#fbf7ef]/90 p-4 shadow-sm backdrop-blur",
        mobile && "sticky bottom-4 border-none bg-transparent p-0 shadow-none",
      )}
    >
      <div className={cn("mb-6 space-y-1 px-2", mobile && "hidden")}>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6a7b71]">Teilnehmerbereich</p>
        <h2 className="text-xl font-semibold text-[#173325]">{session.user.name ?? "Gast"}</h2>
        <p className="text-sm leading-6 text-[#5f7267]">Agenda, Logistik und aktuelle Hinweise immer griffbereit.</p>
      </div>
      <div className={cn("flex flex-col gap-2", mobile && "grid grid-cols-4 rounded-[28px] border border-[#d7e0d3] bg-[#fbf7ef]/95 p-2 shadow-lg")}>
        {attendeeNavigation.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-[#4b6054] transition-colors hover:bg-[#e8eee3] hover:text-[#173325]",
                active && "bg-[#163224] text-[#fbf7ef] hover:bg-[#163224] hover:text-[#fbf7ef]",
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
        <div className="mt-6 rounded-[28px] bg-[#173325] p-4 text-[#fbf7ef]">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <CalendarDays className="size-4" />
            Event Quick Facts
          </div>
          <ul className="space-y-2 text-sm text-[#dbe4de]">
            <li>14.-15. Mai 2026</li>
            <li>Dortmund Kongresszentrum</li>
            <li>QR Check-in vor Ort</li>
          </ul>
          <div className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#c6d3cb]">
            <MapPinned className="size-3.5" />
            Closed corporate event
          </div>
        </div>
      ) : null}
    </nav>
  );
}
