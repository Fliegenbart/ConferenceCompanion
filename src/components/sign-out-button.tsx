"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="w-full justify-start"
      onClick={() =>
        signOut({
          callbackUrl: "/",
        })
      }
    >
      <LogOut className="mr-2 size-4" />
      Abmelden
    </Button>
  );
}
