"use client";

import { ChevronDown } from "lucide-react";
import type { Session } from "next-auth";

import { SignOutButton } from "@/components/sign-out-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function UserMenu({ session }: { session: Session }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-3 rounded-[18px] border border-[#d5ccbf] bg-[#fbf8f3] px-3 py-2 text-left shadow-[0_14px_26px_-22px_rgba(17,19,21,0.28)]">
        <Avatar className="size-9">
          <AvatarFallback>{session.user.name?.slice(0, 1) ?? "U"}</AvatarFallback>
        </Avatar>
        <div className="hidden sm:block">
          <p className="text-sm font-semibold text-[#111315]">{session.user.name ?? session.user.email}</p>
          <p className="text-xs text-[#59616a]">{session.user.email}</p>
        </div>
        <ChevronDown className="size-4 text-[#59616a]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <div className="px-1 py-1">
            <SignOutButton />
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
