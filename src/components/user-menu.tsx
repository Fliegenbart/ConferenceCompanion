"use client";

import { ChevronDown } from "lucide-react";
import type { Session } from "next-auth";

import { SignOutButton } from "@/components/sign-out-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function UserMenu({ session }: { session: Session }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-3 rounded-full border border-[#d8e0d4] bg-white px-3 py-2 text-left shadow-sm">
        <Avatar className="size-9">
          <AvatarFallback>{session.user.name?.slice(0, 1) ?? "U"}</AvatarFallback>
        </Avatar>
        <div className="hidden sm:block">
          <p className="text-sm font-semibold text-[#173325]">{session.user.name ?? session.user.email}</p>
          <p className="text-xs text-[#6d7f74]">{session.user.email}</p>
        </div>
        <ChevronDown className="size-4 text-[#6d7f74]" />
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
