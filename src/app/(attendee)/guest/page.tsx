import { Bell, CalendarClock, CalendarRange, Download, MapPinned } from "lucide-react";

import { AnnouncementFeed } from "@/components/announcement-feed";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { SiteSection } from "@/components/site-section";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { requireAttendeeSession } from "@/lib/auth";
import { getAttendeePortal } from "@/lib/data";
import { formatCountdown } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function GuestHomePage() {
  const session = await requireAttendeeSession();
  const attendee = await getAttendeePortal(session.user.attendeeId!);

  if (!attendee) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Attendee App"
        title={`Willkommen, ${attendee.firstName}`}
        description="Alle relevanten Informationen fuer Ihren Aufenthalt vor und waehrend der Veranstaltung."
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/guest/info">Logistik</Link>
            </Button>
            <Button asChild>
              <Link href="/guest/agenda">Agenda oeffnen</Link>
            </Button>
          </>
        }
      />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Countdown" value={formatCountdown(attendee.event.startDate)} icon={CalendarClock} hint="bis Veranstaltungsstart" />
        <StatCard label="Ausgewaehlte Sessions" value={attendee.sessionSelections.length} icon={CalendarRange} hint="persoenliche Agenda" />
        <StatCard label="Neue Updates" value={attendee.event.announcements.length} icon={Bell} hint="aktuelle Hinweise" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <SiteSection title="Letzte Ankuendigungen" description="Chronologisch nach Relevanz und Aktualitaet sortiert.">
          {attendee.event.announcements.length ? (
            <AnnouncementFeed items={attendee.event.announcements.slice(0, 3)} />
          ) : (
            <EmptyState icon={Bell} title="Noch keine Updates" description="Sobald Organizer neue Hinweise veroeffentlichen, erscheinen sie hier." />
          )}
        </SiteSection>
        <div className="space-y-6">
          <SiteSection title="Quick Links">
            <div className="grid gap-3">
              <Button variant="secondary" className="justify-start" asChild>
                <Link href="/guest/my-agenda">
                  <CalendarRange className="mr-2 size-4" />
                  Meine Agenda
                </Link>
              </Button>
              <Button variant="secondary" className="justify-start" asChild>
                <Link href="/guest/info">
                  <MapPinned className="mr-2 size-4" />
                  Venue & Logistik
                </Link>
              </Button>
              <Button variant="secondary" className="justify-start" asChild>
                <Link href="/guest/downloads">
                  <Download className="mr-2 size-4" />
                  Downloads
                </Link>
              </Button>
            </div>
          </SiteSection>
          <SiteSection title="Ihre Registrierung">
            <div className="space-y-2 text-sm text-[#41584b]">
              <p>Teilnahme: {attendee.attendanceResponse === "YES" ? "Zugesagt" : attendee.attendanceResponse === "NO" ? "Abgesagt" : "Offen"}</p>
              <p>Hotel benoetigt: {attendee.hotelRequired ? "Ja" : "Nein"}</p>
              <p>Check-in Status: {attendee.checkedInAt ? "Vor Ort bestaetigt" : "Noch nicht eingecheckt"}</p>
            </div>
          </SiteSection>
        </div>
      </div>
    </div>
  );
}
