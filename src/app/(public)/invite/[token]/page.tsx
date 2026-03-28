import { notFound } from "next/navigation";

import { RegistrationForm } from "@/components/forms/registration-form";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { getInvitationContext } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function InvitationPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const invitation = await getInvitationContext(token);

  if (!invitation) {
    notFound();
  }

  if (!invitation.openedAt) {
    await prisma.invitation.update({
      where: { id: invitation.id },
      data: {
        openedAt: new Date(),
        status: "OPENED",
      },
    });
  }

  const selectableSessions = invitation.attendee.event
    ? await prisma.sessionModel.findMany({
        where: {
          eventId: invitation.attendee.eventId,
          selectionEnabled: true,
        },
        include: {
          selections: {
            where: {
              status: "CONFIRMED",
            },
          },
        },
        orderBy: { startAt: "asc" },
      })
    : [];

  return (
    <div className="min-h-screen px-4 py-8 md:px-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card className="relative overflow-hidden border-[#1b1d20] bg-[#17191c] p-0 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08)_0%,transparent_32%),linear-gradient(180deg,#1a1c20_0%,#111315_100%)]" />
          <div className="relative space-y-5 p-8 text-white">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d8d2ca]">
                Private Einladung
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d8d2ca]">
                Schritt 1 von 2
              </span>
            </div>
            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d8d2ca]">{invitation.attendee.event.name}</p>
              <h1 className="font-manrope text-5xl tracking-[-0.06em]">Teilnahme bestätigen.</h1>
              <p className="max-w-xl text-base leading-7 text-[#c9c4bd]">
                Hallo {invitation.attendee.firstName}, ergänzen Sie kurz Ihre Angaben und bestätigen Sie Ihre Teilnahme.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#c9c4bd]">Persönlicher Link</div>
              <div className="rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#c9c4bd]">Angaben ergänzen</div>
              <div className="rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#c9c4bd]">Bestätigung erhalten</div>
            </div>
          </div>
        </Card>
        <Card className="p-8">
          <div className="mb-8 space-y-2">
            <h2 className="font-manrope text-3xl font-semibold tracking-[-0.05em] text-[#111315]">Ihre Angaben</h2>
            <p className="text-sm leading-6 text-[#59616a]">
              Wir nutzen Ihre Angaben für Planung, Anreise und Rückfragen.
            </p>
          </div>
          <RegistrationForm
            token={token}
            defaultValues={{
              phone: invitation.attendee.phone ?? invitation.attendee.registration?.phone ?? "",
              attendanceResponse: invitation.attendee.registration?.attendanceResponse ?? invitation.attendee.attendanceResponse,
              dietaryRequirements: invitation.attendee.registration?.dietaryRequirements ?? invitation.attendee.dietaryRequirements ?? "",
              accessibilityNeeds: invitation.attendee.registration?.accessibilityNeeds ?? invitation.attendee.accessibilityNeeds ?? "",
              hotelRequired: invitation.attendee.registration?.hotelRequired ?? invitation.attendee.hotelRequired,
              arrivalInfo: invitation.attendee.registration?.arrivalInfo ?? invitation.attendee.arrivalInfo ?? "",
              departureInfo: invitation.attendee.registration?.departureInfo ?? invitation.attendee.departureInfo ?? "",
              workshopNotes: invitation.attendee.registration?.workshopNotes ?? "",
              selectedSessionIds: invitation.attendee.sessionSelections.map((selection) => selection.sessionId),
              privacyAccepted: invitation.attendee.registration?.privacyAccepted ?? true,
              photoConsentAccepted: invitation.attendee.registration?.photoConsentAccepted ?? false,
            }}
            selectableSessions={selectableSessions.map((session) => ({
              id: session.id,
              title: session.title,
              subtitle: session.subtitle,
              remainingSeats: session.capacity ? Math.max(session.capacity - session.selections.length, 0) : null,
            }))}
          />
        </Card>
      </div>
    </div>
  );
}
