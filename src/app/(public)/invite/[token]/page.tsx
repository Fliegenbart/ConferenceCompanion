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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#dfe8da_0%,#eef2ec_45%,#f6f4ee_100%)] px-4 py-8 md:px-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card className="space-y-5 bg-[#163224] p-8 text-[#fbf7ef]">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c7d4cd]">Private Invitation</p>
            <h1 className="text-4xl">{invitation.attendee.event.name}</h1>
            <p className="max-w-2xl text-base leading-7 text-[#d6e1db]">
              Guten Tag {invitation.attendee.firstName} {invitation.attendee.lastName}, bitte vervollstaendigen Sie hier Ihre Registrierung fuer die geschlossene Veranstaltung.
            </p>
          </div>
        </Card>
        <Card className="p-8">
          <div className="mb-8 space-y-2">
            <h2 className="text-2xl font-semibold text-[#173325]">Registrierung</h2>
            <p className="text-sm leading-6 text-[#5d7065]">
              Die Angaben werden ausschliesslich fuer Organisation, Betreuung und Event-Kommunikation verwendet.
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
