import { AppShell } from "@/components/app-shell";
import { AdminNavigation } from "@/components/admin-navigation";
import { CheckInPanel } from "@/components/check-in-panel";
import { PageHeader } from "@/components/page-header";
import { SiteSection } from "@/components/site-section";
import { Card } from "@/components/ui/card";
import { requireAdminSession } from "@/lib/auth";
import { getCheckInDashboard } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function CheckInPage() {
  const session = await requireAdminSession();
  const checkIn = await getCheckInDashboard(session.user.eventId!);

  return (
    <AppShell session={session} navigation={<AdminNavigation session={session} />} variant="admin">
      <div className="space-y-6">
        <PageHeader
          eyebrow="Einlass"
          title="Einlass"
          description="Code scannen oder Namen suchen."
        />
        <Card className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Eingecheckt", value: checkIn.checkedInCount },
            { label: "Offen", value: checkIn.attendees.length - checkIn.checkedInCount },
            { label: "Veranstaltung", value: checkIn.event.name, isText: true },
          ].map((item) => (
            <div key={item.label} className="rounded-[18px] border border-[#d5ccbf] bg-[#f7f3ed] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6a6256]">{item.label}</p>
              {item.isText ? (
                <p className="mt-2 font-manrope text-xl font-semibold tracking-[-0.04em] text-[#111315]">{item.value}</p>
              ) : (
                <p className="mt-2 font-manrope text-4xl font-semibold tracking-[-0.05em] text-[#111315]">{item.value}</p>
              )}
            </div>
          ))}
        </Card>
        <CheckInPanel
          attendees={checkIn.attendees.map((attendee) => ({
            id: attendee.id,
            label: `${attendee.firstName} ${attendee.lastName} · ${attendee.company ?? attendee.email}`,
            checkedIn: Boolean(attendee.checkedInAt),
          }))}
        />
        <SiteSection title="Zuletzt eingelassen">
          <div className="space-y-3">
            {checkIn.recentCheckIns.map((entry) => (
              <div key={entry.id} className="rounded-[18px] border border-[#d5ccbf] bg-[#f7f3ed] p-4">
                <p className="font-medium text-[#111315]">{entry.attendee.firstName} {entry.attendee.lastName}</p>
                <p className="text-sm text-[#59616a]">
                  {new Date(entry.occurredAt).toLocaleString("de-DE")} · {entry.method === "QR" ? "QR-Code" : "Manuell"}
                </p>
              </div>
            ))}
          </div>
        </SiteSection>
      </div>
    </AppShell>
  );
}
