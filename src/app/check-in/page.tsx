import { AppShell } from "@/components/app-shell";
import { AdminNavigation } from "@/components/admin-navigation";
import { CheckInPanel } from "@/components/check-in-panel";
import { PageHeader } from "@/components/page-header";
import { SiteSection } from "@/components/site-section";
import { requireAdminSession } from "@/lib/auth";
import { getCheckInDashboard } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function CheckInPage() {
  const session = await requireAdminSession();
  const checkIn = await getCheckInDashboard(session.user.eventId!);

  return (
    <AppShell session={session} navigation={<AdminNavigation session={session} />} variant="admin">
      <div className="space-y-6">
        <PageHeader title="Live Check-in" description="QR-Scan, manuelle Suche und Live-Zaehler fuer den Vor-Ort-Betrieb." />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[28px] border border-[#d9e1d5] bg-white p-5">
            <p className="text-sm text-[#5d7065]">Bereits eingecheckt</p>
            <p className="mt-2 text-4xl font-semibold text-[#173325]">{checkIn.checkedInCount}</p>
          </div>
          <div className="rounded-[28px] border border-[#d9e1d5] bg-white p-5">
            <p className="text-sm text-[#5d7065]">Offene Teilnehmer</p>
            <p className="mt-2 text-4xl font-semibold text-[#173325]">{checkIn.attendees.length - checkIn.checkedInCount}</p>
          </div>
          <div className="rounded-[28px] border border-[#d9e1d5] bg-white p-5">
            <p className="text-sm text-[#5d7065]">Event</p>
            <p className="mt-2 text-xl font-semibold text-[#173325]">{checkIn.event.name}</p>
          </div>
        </div>
        <CheckInPanel
          attendees={checkIn.attendees.map((attendee) => ({
            id: attendee.id,
            label: `${attendee.firstName} ${attendee.lastName} · ${attendee.company ?? attendee.email}`,
            checkedIn: Boolean(attendee.checkedInAt),
          }))}
        />
        <SiteSection title="Letzte Check-ins">
          <div className="space-y-3">
            {checkIn.recentCheckIns.map((entry) => (
              <div key={entry.id} className="rounded-[24px] border border-[#d9e1d5] bg-white p-4">
                <p className="font-semibold text-[#173325]">{entry.attendee.firstName} {entry.attendee.lastName}</p>
                <p className="text-sm text-[#5d7065]">{new Date(entry.occurredAt).toLocaleString("de-DE")} · {entry.method}</p>
              </div>
            ))}
          </div>
        </SiteSection>
      </div>
    </AppShell>
  );
}
