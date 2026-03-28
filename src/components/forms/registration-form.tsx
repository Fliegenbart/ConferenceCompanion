"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AttendanceResponse } from "@prisma/client";
import Link from "next/link";
import { startTransition, useDeferredValue, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, type Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";

import { submitRegistrationAction } from "@/actions/attendee";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  const selectedSessions = form.watch("selectedSessionIds");

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
      <div className="flex items-center justify-between gap-4 rounded-[18px] border border-[#d5ccbf] bg-[#f7f3ed] px-4 py-3 text-sm text-[#59616a]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6a6256]">Registrierung</p>
          <p>Schritt 1 von 2 · Angaben ergänzen.</p>
        </div>
        <span className="rounded-full bg-[#ece6de] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#17191c]">
          Persönlicher Link
        </span>
      </div>

      <Card className="space-y-5">
        <CardHeader>
          <CardTitle>Kontakt</CardTitle>
          <CardDescription>Für Rückfragen vor dem Termin.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input id="phone" placeholder="+49 ..." {...form.register("phone")} />
            </div>
            <div className="space-y-3">
              <Label>Teilnahme</Label>
              <Controller
                control={form.control}
                name="attendanceResponse"
                render={({ field }) => (
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      { value: AttendanceResponse.YES, label: "Dabei" },
                      { value: AttendanceResponse.NO, label: "Nein" },
                      { value: AttendanceResponse.UNDECIDED, label: "Offen" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="flex cursor-pointer items-center justify-between rounded-[16px] border border-[#d5ccbf] bg-[#f7f3ed] px-4 py-3 text-sm text-[#111315] transition-colors hover:bg-[#ffffff]"
                      >
                        <span>{option.label}</span>
                        <input
                          type="radio"
                          name={field.name}
                          ref={field.ref}
                          value={option.value}
                          className="size-4 accent-[#17191c]"
                          checked={field.value === option.value}
                          onBlur={field.onBlur}
                          onChange={() => field.onChange(option.value)}
                        />
                      </label>
                    ))}
                  </div>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="space-y-5">
        <CardHeader>
          <CardTitle>Logistik</CardTitle>
          <CardDescription>Anreise, Hotel und Unterstützung.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dietaryRequirements">Ernährungsanforderungen</Label>
              <Textarea id="dietaryRequirements" placeholder="z. B. vegetarisch, Allergien" {...form.register("dietaryRequirements")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accessibilityNeeds">Barrierefreiheit</Label>
              <Textarea id="accessibilityNeeds" placeholder="z. B. stufenfreier Zugang, besondere Unterstützung" {...form.register("accessibilityNeeds")} />
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

          <div className="rounded-[18px] border border-[#d5ccbf] bg-[#f7f3ed] p-4">
            <label className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-[#111315]">Hotel benötigt</p>
                <p className="text-sm text-[#59616a]">Aktivieren, wenn Sie ein Zimmer brauchen.</p>
              </div>
              <Checkbox checked={form.watch("hotelRequired")} onCheckedChange={(value) => form.setValue("hotelRequired", Boolean(value))} />
            </label>
          </div>
        </CardContent>
      </Card>

      {attendanceResponse === AttendanceResponse.YES ? (
        <Card className="space-y-5">
        <CardHeader>
          <CardTitle>Sitzungen</CardTitle>
          <CardDescription>Wählen Sie die Programmpunkte, die Sie besuchen möchten.</CardDescription>
        </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {selectableSessions.map((session) => {
                const checked = selectedSessions.includes(session.id);

                return (
                  <label
                    key={session.id}
                    className="flex items-start gap-3 rounded-[16px] border border-[#d5ccbf] bg-[#f7f3ed] px-4 py-4 text-sm text-[#111315] transition-colors hover:bg-[#ffffff]"
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
                      <p className="font-medium text-[#111315]">{session.title}</p>
                      {session.subtitle ? <p className="text-[#59616a]">{session.subtitle}</p> : null}
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#7a7f84]">
                        {session.remainingSeats === null ? "Freie Auswahl" : `${session.remainingSeats} Plätze frei`}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card className="space-y-5">
        <CardHeader>
          <CardTitle>Hinweise</CardTitle>
          <CardDescription>Zusätzliche Angaben für das Team.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="workshopNotes">Zusatzhinweise</Label>
            <Textarea id="workshopNotes" placeholder="Weitere Hinweise für das Veranstaltungsteam" {...form.register("workshopNotes")} />
          </div>
        </CardContent>
      </Card>

      <Card className="space-y-5 bg-[#f7f3ed]">
        <CardHeader>
          <CardTitle>Einwilligungen</CardTitle>
          <CardDescription>Vor dem Absenden bitte bestätigen.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-start gap-3 text-sm text-[#1a1c1c]">
            <Checkbox
              checked={form.watch("privacyAccepted")}
              onCheckedChange={(value) => form.setValue("privacyAccepted", Boolean(value))}
            />
            <span>
              {PRIVACY_CONSENT_LABEL}{" "}
              <Link href="/privacy-policy" className="font-semibold text-[#17191c] underline underline-offset-4">
                Datenschutz
              </Link>{" "}
              und{" "}
              <Link href="/legal" className="font-semibold text-[#17191c] underline underline-offset-4">
                Rechtliche Hinweise
              </Link>
              .
            </span>
          </label>
          <label className="flex items-start gap-3 text-sm text-[#1a1c1c]">
            <Checkbox
              checked={form.watch("photoConsentAccepted")}
              onCheckedChange={(value) => form.setValue("photoConsentAccepted", Boolean(value))}
            />
            <span>{PHOTO_CONSENT_LABEL}</span>
          </label>
        </CardContent>
      </Card>

      <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isSubmitting}>
        {isSubmitting ? "Speichern..." : "Jetzt registrieren"}
      </Button>
    </form>
  );
}
