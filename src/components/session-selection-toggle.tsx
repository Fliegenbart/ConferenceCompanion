"use client";

import { LoaderCircle } from "lucide-react";
import { startTransition, useState } from "react";
import { toast } from "sonner";

import { toggleSessionSelectionAction } from "@/actions/attendee";
import { Button } from "@/components/ui/button";

export function SessionSelectionToggle({
  sessionId,
  selected,
}: {
  sessionId: string;
  selected: boolean;
}) {
  const [isPending, setIsPending] = useState(false);

  return (
    <Button
      variant={selected ? "secondary" : "default"}
      size="sm"
      disabled={isPending}
      onClick={() => {
        setIsPending(true);

        startTransition(async () => {
          const result = await toggleSessionSelectionAction(sessionId, !selected);
          setIsPending(false);

          if (!result.ok) {
            toast.error(result.message);
            return;
          }

          toast.success(result.message);
        });
      }}
    >
      {isPending ? <LoaderCircle className="mr-2 size-4 animate-spin" /> : null}
      {selected ? "Entfernen" : "Zu meiner Agenda"}
    </Button>
  );
}
