"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { guestLoginSchema } from "@/lib/validations";

type GuestLoginValues = z.infer<typeof guestLoginSchema>;

export function GuestLoginForm({ defaultEmail }: { defaultEmail?: string }) {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const form = useForm<GuestLoginValues>({
    resolver: zodResolver(guestLoginSchema),
    defaultValues: {
      email: defaultEmail ?? searchParams.get("email") ?? "",
    },
  });

  const onSubmit = (values: GuestLoginValues) => {
    startTransition(async () => {
      const result = await signIn("email", {
        email: values.email,
        callbackUrl: "/login/redirect",
        redirect: false,
      });

      if (result?.error) {
        toast.error("Der Link konnte nicht gesendet werden.");
        return;
      }

      toast.success("Wenn die Adresse freigegeben ist, ist der Link unterwegs.");
    });
  };

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
          <Label htmlFor="email">E-Mail-Adresse</Label>
          <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#717976]" />
          <Input id="email" type="email" className="pl-10" placeholder="vorname.nachname@unternehmen.de" {...form.register("email")} />
        </div>
        {form.formState.errors.email ? (
          <p className="text-sm text-[#4f2d26]">{form.formState.errors.email.message}</p>
        ) : null}
        <p className="text-xs text-[#7a7f84]">Mit dieser E-Mail öffnen Sie Ihren Bereich.</p>
      </div>
      <Button type="submit" className="w-full" size="lg" disabled={isPending}>
        {isPending ? <LoaderCircle className="mr-2 size-4 animate-spin" /> : null}
        Link senden
      </Button>
    </form>
  );
}
