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
      dark: "#163224",
      light: "#FBF7EF",
    },
  });

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#dfe8da_0%,#eef2ec_45%,#f6f4ee_100%)] px-4 py-8">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_0.8fr]">
        <Card className="space-y-5 bg-[#163224] p-8 text-[#fbf7ef]">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c7d4cd]">Registration Complete</p>
          <h1 className="text-4xl">Vielen Dank fuer Ihre Rueckmeldung</h1>
          <p className="leading-7 text-[#d8e3dc]">
            Ihre Registrierung fuer {invitation.attendee.event.name} wurde erfolgreich gespeichert. Im Teilnehmerbereich finden Sie Agenda, Updates und Logistik.
          </p>
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-[#dbe5de]">
            <p>Teilnahme: {invitation.attendee.attendanceResponse === "YES" ? "Zugesagt" : invitation.attendee.attendanceResponse === "NO" ? "Abgesagt" : "Offen"}</p>
            <p>Hotel benoetigt: {invitation.attendee.hotelRequired ? "Ja" : "Nein"}</p>
            <p>Kontakt: {invitation.attendee.email}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href={`/login?email=${encodeURIComponent(invitation.attendee.email)}`}>Zum Teilnehmerbereich</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Zur Startseite</Link>
            </Button>
          </div>
        </Card>
        <Card className="space-y-5 p-8 text-center">
          <h2 className="text-2xl text-[#173325]">QR Code fuer Check-in</h2>
          <p className="text-sm leading-6 text-[#5d7065]">Bitte halten Sie diesen Code vor Ort bereit. Er ist auch in Ihrer Bestaetigungs-E-Mail enthalten.</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrDataUrl} alt="QR Code fuer Check-in" className="mx-auto size-72 rounded-[28px] border border-[#d8e0d4] bg-[#fbf7ef] p-4" />
        </Card>
      </div>
    </div>
  );
}
