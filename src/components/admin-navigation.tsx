"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Session } from "next-auth";

import { adminNavigation } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function AdminNavigation({ session }: { session: Session }) {
  const pathname = usePathname();

  return (
    <nav className="rounded-[22px] border border-[#d5ccbf]/80 bg-[#ffffff]/95 p-4 shadow-[0_18px_28px_-24px_rgba(17,19,21,0.25)]">
      <div className="mb-6 space-y-1 px-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#6a6256]">Administrationsbereich</p>
        <h2 className="font-manrope text-xl font-semibold tracking-[-0.04em] text-[#111315]">{session.user.name ?? "Admin"}</h2>
        <p className="text-sm leading-6 text-[#59616a]">Einladungen, Agenda, Inhalte und Einlass.</p>
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
                "flex items-center gap-3 rounded-[16px] px-4 py-3 text-sm font-medium text-[#5f584f] transition-all hover:bg-[#f0ebe3] hover:text-[#111315]",
                active &&
                  "bg-[#17191c] text-white shadow-[0_20px_36px_-24px_rgba(17,19,21,0.65)] hover:bg-[#17191c] hover:text-white",
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
