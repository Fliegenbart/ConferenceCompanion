import type { ReactNode } from "react";

import { BrandMark } from "@/components/brand-mark";
import { UserMenu } from "@/components/user-menu";
import { cn } from "@/lib/utils";
import type { Session } from "next-auth";

export function AppShell({
  session,
  navigation,
  mobileNavigation,
  children,
  variant = "attendee",
}: {
  session: Session;
  navigation: ReactNode;
  mobileNavigation?: ReactNode;
  children: ReactNode;
  variant?: "attendee" | "admin";
}) {
  return (
    <div
      className={cn(
        "min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.78)_0%,rgba(245,241,234,0.92)_32%,#f5f1ea_100%)]",
        variant === "admin" && "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.88)_0%,rgba(243,238,229,0.94)_36%,#f3ede5_100%)]",
      )}
    >
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col px-4 py-4 md:px-6 md:py-6 lg:flex-row lg:gap-6">
        <aside className="hidden w-72 shrink-0 lg:block">{navigation}</aside>
        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-20 mb-4 rounded-[22px] border border-[#d5ccbf]/80 bg-[#ffffff]/92 px-5 py-4 shadow-[0_18px_28px_-24px_rgba(17,19,21,0.28)]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <BrandMark />
              <UserMenu session={session} />
            </div>
          </header>
          <main className="flex-1">{children}</main>
          {mobileNavigation ? <div className="mt-6 lg:hidden">{mobileNavigation}</div> : null}
        </div>
      </div>
    </div>
  );
}
