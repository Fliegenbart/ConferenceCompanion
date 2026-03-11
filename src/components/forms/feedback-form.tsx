"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FeedbackRating, FeedbackType } from "@prisma/client";
import { LoaderCircle } from "lucide-react";
import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { submitFeedbackAction } from "@/actions/attendee";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { feedbackSchema } from "@/lib/validations";

type FeedbackValues = z.infer<typeof feedbackSchema>;

export function FeedbackForm({
  attendeeId,
  type,
  sessionId,
  title,
}: {
  attendeeId: string;
  type: FeedbackType;
  sessionId?: string;
  title: string;
}) {
  const [isPending, setIsPending] = useState(false);
  const form = useForm<FeedbackValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      type,
      sessionId,
      rating: FeedbackRating.GOOD,
      comment: "",
    },
  });

  const onSubmit = (values: FeedbackValues) => {
    setIsPending(true);
    startTransition(async () => {
      const result = await submitFeedbackAction(attendeeId, values);
      setIsPending(false);

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      form.reset({
        ...values,
        comment: "",
      });
      toast.success(result.message);
    });
  };

  return (
    <form className="space-y-4 rounded-[28px] border border-[#d9e1d5] bg-white p-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div>
        <h3 className="text-lg font-semibold text-[#173325]">{title}</h3>
        <p className="text-sm text-[#5d7065]">Kurzes, konkretes Feedback hilft dem Event-Team fuer die Nachbereitung.</p>
      </div>
      <div className="space-y-2">
        <Label>Bewertung</Label>
        <div className="grid gap-2 sm:grid-cols-5">
          {Object.values(FeedbackRating).map((rating) => (
            <label key={rating} className="rounded-2xl border border-[#d7dfd3] px-3 py-3 text-center text-sm text-[#284334]">
              <input
                type="radio"
                className="sr-only"
                checked={form.watch("rating") === rating}
                onChange={() => form.setValue("rating", rating)}
              />
              {rating}
            </label>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${title}-comment`}>Kommentar</Label>
        <Textarea id={`${title}-comment`} placeholder="Ihr Eindruck, konkrete Hinweise, Verbesserungsvorschlaege" {...form.register("comment")} />
      </div>
      <input type="hidden" {...form.register("type")} />
      <input type="hidden" {...form.register("sessionId")} />
      <Button type="submit" disabled={isPending}>
        {isPending ? <LoaderCircle className="mr-2 size-4 animate-spin" /> : null}
        Feedback senden
      </Button>
    </form>
  );
}
