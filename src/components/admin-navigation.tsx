"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Session } from "next-auth";

import { adminNavigation } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function AdminNavigation({ session }: { session: Session }) {
  const pathname = usePathname();

  return (
    <nav className="rounded-[32px] border border-[#d7e0d3] bg-[#fbf7ef]/90 p-4 shadow-sm backdrop-blur">
      <div className="mb-6 space-y-1 px-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6a7b71]">Organizer Dashboard</p>
        <h2 className="text-xl font-semibold text-[#173325]">{session.user.name ?? "Admin"}</h2>
        <p className="text-sm leading-6 text-[#5f7267]">Verwaltung von Registrierungen, Agenda, Kommunikation und Check-in.</p>
      </div>
      <div className="flex flex-col gap-2">
        {adminNavigation.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-[#4b6054] transition-colors hover:bg-[#e8eee3] hover:text-[#173325]",
                active && "bg-[#163224] text-[#fbf7ef] hover:bg-[#163224] hover:text-[#fbf7ef]",
              )}
            >
              <Icon className="size-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
