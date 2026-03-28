import Link from "next/link";
import QRCode from "qrcode";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createCheckInToken } from "@/lib/tokens";
import { getInvitationContext } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ConfirmationPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const invitation = await getInvitationContext(token);

  if (!invitation?.attendee.registration) {
    redirect(`/invite/${token}`);
  }

  const qrToken = await createCheckInToken({
    attendeeId: invitation.attendee.id,
    eventId: invitation.attendee.eventId,
    email: invitation.attendee.email,
  });
  const qrDataUrl = await QRCode.toDataURL(qrToken, {
    margin: 1,
    color: {
      dark: "#17191c",
      light: "#fbf8f3",
    },
  });

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_0.8fr]">
        <Card className="space-y-5 border-[#1b1d20] bg-[#17191c] p-8 text-[#fbf8f3]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d8d2ca]">Registrierung abgeschlossen</p>
          <h1 className="font-manrope text-5xl tracking-[-0.06em]">Anmeldung gespeichert.</h1>
          <p className="leading-7 text-[#c9c4bd]">
            Ihre Angaben zu {invitation.attendee.event.name} sind gespeichert. Agenda, Hinweise und Einlass stehen jetzt im Teilnehmerbereich bereit.
          </p>
          <div className="rounded-[18px] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-[#c9c4bd]">
            <p>Teilnahme: {invitation.attendee.attendanceResponse === "YES" ? "Zugesagt" : invitation.attendee.attendanceResponse === "NO" ? "Abgesagt" : "Offen"}</p>
            <p>Hotel: {invitation.attendee.hotelRequired ? "Ja" : "Nein"}</p>
            <p>Kontakt: {invitation.attendee.email}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href={`/login?email=${encodeURIComponent(invitation.attendee.email)}`}>Zum Bereich</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Zur Startseite</Link>
            </Button>
          </div>
        </Card>
        <Card className="space-y-5 p-8 text-center">
          <h2 className="font-manrope text-3xl tracking-[-0.05em] text-[#111315]">Ihr QR-Code</h2>
          <p className="text-sm leading-6 text-[#59616a]">Vor Ort einfach vorzeigen. Der Code steht auch in Ihrer E-Mail.</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrDataUrl} alt="QR-Code für den Einlass" className="mx-auto size-72 rounded-[18px] border border-[#d5ccbf] bg-[#f7f3ed] p-4" />
        </Card>
      </div>
    </div>
  );
}
