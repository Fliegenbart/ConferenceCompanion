import { Activity, CalendarRange, CheckCircle2, MessageSquareMore, MailPlus, Users } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { SiteSection } from "@/components/site-section";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireAdminSession } from "@/lib/auth";
import { getAdminDashboard } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const registrationStatusLabels: Record<string, string> = {
  PENDING: "Ausstehend",
  COMPLETED: "Abgeschlossen",
  UPDATED: "Aktualisiert",
  DECLINED: "Abgelehnt",
  CANCELLED: "Storniert",
};

export default async function AdminDashboardPage() {
  const session = await requireAdminSession();
  const dashboard = await getAdminDashboard(session.user.eventId!);
  const eventDates = `${formatDate(dashboard.event.startDate)} bis ${formatDate(dashboard.event.endDate)}`;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Administrationsbereich"
        title="Event verwalten"
        description="Antworten prüfen, Plätze steuern, Einlass verfolgen."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href="/admin/attendees">
                <Users className="mr-2 size-4" />
                Teilnehmer
              </Link>
            </Button>
            <Button asChild>
              <Link href="/admin/messaging">
                <MessageSquareMore className="mr-2 size-4" />
                Nachricht
              </Link>
            </Button>
          </>
        }
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Eingeladen" value={dashboard.invited} icon={Users} />
        <StatCard label="Registriert" value={dashboard.registered} icon={CalendarRange} />
        <StatCard label="Abgesagt" value={dashboard.declined} icon={Activity} />
        <StatCard label="Einlass" value={dashboard.checkedIn} icon={CheckCircle2} />
      </div>
      <Card className="space-y-5 border-[#1b1d20] bg-[#17191c] p-7 text-white md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#d8d2ca]">Veranstaltung</p>
            <h2 className="max-w-[12ch] font-manrope text-5xl font-semibold leading-[0.92] tracking-[-0.08em] text-white">
              {dashboard.event.name}
            </h2>
            <p className="text-sm uppercase tracking-[0.2em] text-[#d8d2ca]">
              {eventDates} · {dashboard.event.locationCity}
            </p>
            <p className="max-w-2xl text-sm leading-7 text-[#c9c4bd]">
              Antworten, freie Plätze und Einlass im Blick.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d8d2ca]">
                {dashboard.invited} eingeladen
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d8d2ca]">
                {dashboard.registered} registriert
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d8d2ca]">
                {dashboard.checkedIn} vor Ort
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/admin/attendees">
                  <MailPlus className="mr-2 size-4" />
                  Einladungen senden
                </Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/admin/content">Inhalte</Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: "Sessions", value: dashboard.sessions.length, hint: "im Programm" },
              { label: "Änderungen", value: dashboard.recentLogs.length, hint: "zuletzt gespeichert" },
              { label: "Registrierungen", value: dashboard.registered, hint: "zugesagt oder aktualisiert" },
              { label: "Einlass", value: dashboard.checkedIn, hint: "schon vor Ort" },
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

      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <SiteSection title="Kapazitäten" description="Freie Plätze und Auslastung.">
          <div className="space-y-3">
            {dashboard.sessions.slice(0, 5).map((sessionItem) => {
              const fill = sessionItem.capacity ? Math.min((sessionItem.selections.length / sessionItem.capacity) * 100, 100) : 0;

              return (
                <div key={sessionItem.id} className="rounded-[18px] border border-[#d5ccbf] bg-[#f7f3ed] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-[#111315]">{sessionItem.title}</p>
                      <p className="text-sm text-[#59616a]">{sessionItem.room?.name ?? "Raum folgt"}</p>
                    </div>
                    <p className="text-sm text-[#59616a]">
                      {sessionItem.capacity ? `${sessionItem.selections.length}/${sessionItem.capacity}` : "ohne Limit"}
                    </p>
                  </div>
                  {sessionItem.capacity ? (
                    <div className="mt-3 h-2 rounded-full bg-[#e4ddd3]">
                      <div className="h-2 rounded-full bg-[#17191c]" style={{ width: `${fill}%` }} />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </SiteSection>

        <SiteSection title="Neu registriert" description="Zuletzt eingegangene Antworten.">
          <div className="space-y-3">
            {dashboard.attendees.slice(0, 5).map((attendee) => (
              <div key={attendee.id} className="rounded-[18px] border border-[#d5ccbf] bg-[#f7f3ed] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-[#111315]">
                      {attendee.firstName} {attendee.lastName}
                    </p>
                    <p className="text-sm text-[#59616a]">{attendee.company ?? attendee.email}</p>
                  </div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[#7a7f84]">{registrationStatusLabels[attendee.registrationStatus]}</p>
                </div>
              </div>
            ))}
          </div>
        </SiteSection>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <SiteSection title="Änderungen" description="Letzte Aktionen im Team.">
          <div className="space-y-3">
            {dashboard.recentLogs.map((log) => (
              <div key={log.id} className="rounded-[18px] border border-[#d5ccbf] bg-[#f7f3ed] p-4">
                <p className="font-medium text-[#111315]">{log.summary}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#7a7f84]">
                  {log.entityType} · {log.action}
                </p>
              </div>
            ))}
          </div>
        </SiteSection>

        <SiteSection title="Schnellzugriff" description="Sofort loslegen.">
          <div className="grid gap-3">
            <Button variant="secondary" asChild className="justify-start">
              <Link href="/admin/messaging">Mitteilung senden</Link>
            </Button>
            <Button variant="secondary" asChild className="justify-start">
              <Link href="/admin/agenda">Agenda bearbeiten</Link>
            </Button>
            <Button variant="secondary" asChild className="justify-start">
              <Link href="/check-in">Einlass starten</Link>
            </Button>
          </div>
        </SiteSection>
      </div>
    </div>
  );
}
