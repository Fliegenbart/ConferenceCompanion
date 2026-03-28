import { Bell, CalendarClock, CalendarRange, Download, MapPinned } from "lucide-react";

import { AnnouncementFeed } from "@/components/announcement-feed";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { SiteSection } from "@/components/site-section";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireAttendeeSession } from "@/lib/auth";
import { getAttendeePortal } from "@/lib/data";
import { formatCountdown, formatDate } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function GuestHomePage() {
  const session = await requireAttendeeSession();
  const attendee = await getAttendeePortal(session.user.attendeeId!);

  if (!attendee) {
    return null;
  }

  const eventDates = `${formatDate(attendee.event.startDate)} bis ${formatDate(attendee.event.endDate)}`;
  const eventCity = attendee.event.locationCity.replace(/^\d{5}\s*/, "").trim();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Heute"
        title={`Hallo, ${attendee.firstName}.`}
        description="Agenda prüfen, Hinweise lesen, Einlass bereithalten."
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/guest/info">Event-Info</Link>
            </Button>
            <Button asChild>
              <Link href="/guest/agenda">Agenda</Link>
            </Button>
          </>
        }
      />
      <Card className="relative overflow-hidden border-[#1b1d20] bg-[#17191c] p-0 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08)_0%,transparent_32%),linear-gradient(180deg,#1a1c20_0%,#111315_100%)]" />
        <div className="relative grid gap-6 p-7 text-white lg:grid-cols-[1.12fr_0.88fr] lg:p-9">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d8d2ca]">
                Ihre Veranstaltung
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d8d2ca]">
                {formatCountdown(attendee.event.startDate)}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d8d2ca]">
                {eventCity}
              </span>
            </div>
            <div className="space-y-3">
              <h2 className="max-w-[11ch] font-manrope text-5xl leading-[0.92] tracking-[-0.08em] md:text-[4.4rem]">
                {attendee.event.name}
              </h2>
              <p className="text-sm uppercase tracking-[0.2em] text-[#d8d2ca]">{eventDates}</p>
              <p className="max-w-xl text-base leading-7 text-[#c9c4bd]">
                Agenda, Ort und neue Hinweise stehen für Sie bereit.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/guest/agenda">Agenda</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/guest/my-agenda">Mein Plan</Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: "Ort", value: eventCity, hint: "Veranstaltungsort" },
              { label: "Sessions", value: attendee.sessionSelections.length, hint: "In Ihrem Plan" },
              { label: "Updates", value: attendee.event.announcements.length, hint: "Neue Hinweise" },
              { label: "Einlass", value: attendee.checkedInAt ? "Erledigt" : "Offen", hint: "Status vor Ort" },
            ].map((item) => (
              <div key={item.label} className="rounded-[18px] border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d8d2ca]">{item.label}</p>
                <p className="mt-2 font-manrope text-3xl font-semibold tracking-[-0.05em] text-white">{item.value}</p>
                <p className="mt-1 text-sm text-[#c9c4bd]">{item.hint}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Start" value={formatCountdown(attendee.event.startDate)} icon={CalendarClock} hint="bis zum Start" />
        <StatCard label="Mein Plan" value={attendee.sessionSelections.length} icon={CalendarRange} hint="gewählte Sessions" />
        <StatCard label="Updates" value={attendee.event.announcements.length} icon={Bell} hint="offene Hinweise" />
        <StatCard label="Downloads" value={attendee.event.downloads.length} icon={Download} hint="Pläne und PDFs" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <SiteSection title="Neue Hinweise" description="Was jetzt wichtig ist.">
          {attendee.event.announcements.length ? (
            <AnnouncementFeed items={attendee.event.announcements.slice(0, 3)} />
          ) : (
            <EmptyState icon={Bell} title="Noch nichts neu" description="Neue Hinweise stehen hier." />
          )}
        </SiteSection>
        <div className="space-y-6">
          <SiteSection title="Direkt öffnen">
            <div className="grid gap-3">
              <Button variant="secondary" className="justify-start" asChild>
                <Link href="/guest/my-agenda">
                  <CalendarRange className="mr-2 size-4" />
                  Mein Plan
                </Link>
              </Button>
              <Button variant="secondary" className="justify-start" asChild>
                <Link href="/guest/info">
                  <MapPinned className="mr-2 size-4" />
                  Event-Info
                </Link>
              </Button>
              <Button variant="secondary" className="justify-start" asChild>
                <Link href="/guest/downloads">
                  <Download className="mr-2 size-4" />
                  Unterlagen
                </Link>
              </Button>
            </div>
          </SiteSection>
          <SiteSection title="Ihre Angaben">
            <div className="grid gap-3">
              {[
                { label: "Teilnahme", value: attendee.attendanceResponse === "YES" ? "Zugesagt" : attendee.attendanceResponse === "NO" ? "Abgesagt" : "Offen" },
                { label: "Hotel", value: attendee.hotelRequired ? "Ja" : "Nein" },
                { label: "Einlass", value: attendee.checkedInAt ? "Erledigt" : "Offen" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-[16px] border border-[#ddd6cb] bg-[#f7f3ed] px-4 py-3">
                  <span className="text-sm text-[#59616a]">{item.label}</span>
                  <span className="font-medium text-[#111315]">{item.value}</span>
                </div>
              ))}
            </div>
          </SiteSection>
        </div>
      </div>
    </div>
  );
}
