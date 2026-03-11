"use client";

import { Building2, LoaderCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function AdminLoginButton({ providerId }: { providerId: string }) {
  const [isPending, setIsPending] = useState(false);

  return (
    <Button
      type="button"
      size="lg"
      className="w-full md:w-auto"
      disabled={isPending}
      onClick={async () => {
        setIsPending(true);
        await signIn(providerId, {
          callbackUrl: "/admin",
        });
      }}
    >
      {isPending ? <LoaderCircle className="mr-2 size-4 animate-spin" /> : <Building2 className="mr-2 size-4" />}
      Mit Microsoft Entra ID anmelden
    </Button>
  );
}
