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
        "min-h-screen bg-[radial-gradient(circle_at_top,#dfe8da_0%,#eef2ec_42%,#f6f4ee_100%)]",
        variant === "admin" && "bg-[radial-gradient(circle_at_top,#d9e3dc_0%,#eef1ea_35%,#f6f1ea_100%)]",
      )}
    >
      <div className="mx-auto flex min-h-screen max-w-[1480px] flex-col px-4 py-4 md:px-6 md:py-6 lg:flex-row lg:gap-6">
        <aside className="hidden w-72 shrink-0 lg:block">{navigation}</aside>
        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-20 mb-4 rounded-[32px] border border-[#d7e0d3] bg-[#fbf7ef]/85 px-5 py-4 shadow-sm backdrop-blur">
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
