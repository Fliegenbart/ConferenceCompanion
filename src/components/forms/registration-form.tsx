"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AttendanceResponse } from "@prisma/client";
import Link from "next/link";
import { startTransition, useDeferredValue, useState } from "react";
import { useRouter } from "next/navigation";
import { type Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";

import { submitRegistrationAction } from "@/actions/attendee";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PHOTO_CONSENT_LABEL, PRIVACY_CONSENT_LABEL } from "@/lib/constants";
import { registrationSchema } from "@/lib/validations";

type RegistrationValues = {
  phone?: string;
  attendanceResponse: AttendanceResponse;
  dietaryRequirements?: string;
  accessibilityNeeds?: string;
  hotelRequired: boolean;
  arrivalInfo?: string;
  departureInfo?: string;
  workshopNotes?: string;
  selectedSessionIds: string[];
  privacyAccepted: boolean;
  photoConsentAccepted: boolean;
};

export function RegistrationForm({
  token,
  defaultValues,
  selectableSessions,
}: {
  token: string;
  defaultValues: Partial<RegistrationValues>;
  selectableSessions: {
    id: string;
    title: string;
    subtitle?: string | null;
    remainingSeats: number | null;
  }[];
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema) as Resolver<RegistrationValues>,
    defaultValues: {
      attendanceResponse: defaultValues.attendanceResponse ?? AttendanceResponse.YES,
      dietaryRequirements: defaultValues.dietaryRequirements ?? "",
      accessibilityNeeds: defaultValues.accessibilityNeeds ?? "",
      hotelRequired: defaultValues.hotelRequired ?? false,
      arrivalInfo: defaultValues.arrivalInfo ?? "",
      departureInfo: defaultValues.departureInfo ?? "",
      workshopNotes: defaultValues.workshopNotes ?? "",
      phone: defaultValues.phone ?? "",
      selectedSessionIds: defaultValues.selectedSessionIds ?? [],
      privacyAccepted: defaultValues.privacyAccepted ?? true,
      photoConsentAccepted: defaultValues.photoConsentAccepted ?? false,
    },
  });

  const attendanceResponse = useDeferredValue(form.watch("attendanceResponse"));

  const onSubmit = (values: RegistrationValues) => {
    setIsSubmitting(true);

    startTransition(async () => {
      const result = await submitRegistrationAction(token, values);
      setIsSubmitting(false);

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.push(result.redirectTo ?? `/invite/${token}/confirmation`);
    });
  };

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Telefon</Label>
          <Input id="phone" placeholder="+49 ..." {...form.register("phone")} />
        </div>
        <div className="space-y-3">
          <Label>Teilnahme</Label>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { value: AttendanceResponse.YES, label: "Ich nehme teil" },
              { value: AttendanceResponse.NO, label: "Ich nehme nicht teil" },
              { value: AttendanceResponse.UNDECIDED, label: "Noch offen" },
            ].map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center justify-between rounded-3xl border border-[#d4ddd0] bg-white px-4 py-3 text-sm text-[#284334]"
              >
                <span>{option.label}</span>
                <input
                  type="radio"
                  value={option.value}
                  className="size-4 accent-[#da4f29]"
                  checked={form.watch("attendanceResponse") === option.value}
                  onChange={() => form.setValue("attendanceResponse", option.value)}
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="dietaryRequirements">Ernaehrungsanforderungen</Label>
          <Textarea id="dietaryRequirements" placeholder="z. B. vegetarisch, Allergien" {...form.register("dietaryRequirements")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="accessibilityNeeds">Barrierefreiheit / Accessibility</Label>
          <Textarea id="accessibilityNeeds" placeholder="z. B. stufenfreier Zugang, besondere Unterstuetzung" {...form.register("accessibilityNeeds")} />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="arrivalInfo">Anreise</Label>
          <Textarea id="arrivalInfo" placeholder="Ankunftszeit, Verkehrsmittel, Hinweise" {...form.register("arrivalInfo")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="departureInfo">Abreise</Label>
          <Textarea id="departureInfo" placeholder="Abreisezeit, Transferbedarf" {...form.register("departureInfo")} />
        </div>
      </div>

      <div className="rounded-[28px] border border-[#d9e1d5] bg-[#f8faf6] p-5">
        <label className="flex items-center justify-between gap-4">
          <div>
            <p className="font-medium text-[#173325]">Hotel benoetigt</p>
            <p className="text-sm text-[#5f7267]">Bitte aktivieren, wenn ein Hotelzimmer organisiert werden soll.</p>
          </div>
          <Checkbox checked={form.watch("hotelRequired")} onCheckedChange={(value) => form.setValue("hotelRequired", Boolean(value))} />
        </label>
      </div>

      {attendanceResponse === AttendanceResponse.YES ? (
        <div className="space-y-4 rounded-[28px] border border-[#d9e1d5] bg-white p-5">
          <div>
            <h3 className="text-lg font-semibold text-[#173325]">Workshop-Auswahl</h3>
            <p className="text-sm text-[#5d7065]">Waehlen Sie optionale Sessions fuer Ihre persoenliche Agenda aus.</p>
          </div>
          <div className="grid gap-3">
            {selectableSessions.map((session) => {
              const checked = form.watch("selectedSessionIds").includes(session.id);

              return (
                <label
                  key={session.id}
                  className="flex items-start gap-3 rounded-3xl border border-[#d8e0d4] px-4 py-4 text-sm text-[#284334]"
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(value) => {
                      const selected = new Set(form.getValues("selectedSessionIds"));

                      if (value) {
                        selected.add(session.id);
                      } else {
                        selected.delete(session.id);
                      }

                      form.setValue("selectedSessionIds", [...selected]);
                    }}
                  />
                  <div>
                    <p className="font-medium text-[#173325]">{session.title}</p>
                    {session.subtitle ? <p className="text-[#5f7267]">{session.subtitle}</p> : null}
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#6e8075]">
                      {session.remainingSeats === null ? "Freie Auswahl" : `${session.remainingSeats} Plaetze verfuegbar`}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="workshopNotes">Zusatzhinweise</Label>
        <Textarea id="workshopNotes" placeholder="Weitere Hinweise fuer das Event-Team" {...form.register("workshopNotes")} />
      </div>

      <div className="space-y-4 rounded-[28px] border border-[#d9e1d5] bg-[#f8faf6] p-5">
        <label className="flex items-start gap-3 text-sm text-[#284334]">
          <Checkbox
            checked={form.watch("privacyAccepted")}
            onCheckedChange={(value) => form.setValue("privacyAccepted", Boolean(value))}
          />
          <span>
            {PRIVACY_CONSENT_LABEL}{" "}
            <Link href="/privacy-policy" className="font-semibold text-[#8a3d26] underline underline-offset-4">
              Datenschutz
            </Link>{" "}
            und{" "}
            <Link href="/legal" className="font-semibold text-[#8a3d26] underline underline-offset-4">
              Rechtliche Hinweise
            </Link>
            .
          </span>
        </label>
        <label className="flex items-start gap-3 text-sm text-[#284334]">
          <Checkbox
            checked={form.watch("photoConsentAccepted")}
            onCheckedChange={(value) => form.setValue("photoConsentAccepted", Boolean(value))}
          />
          <span>{PHOTO_CONSENT_LABEL}</span>
        </label>
      </div>

      <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isSubmitting}>
        {isSubmitting ? "Speichern..." : "Registrierung abschliessen"}
      </Button>
    </form>
  );
}
