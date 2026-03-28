import { PageHeader } from "@/components/page-header";
import { SessionCard } from "@/components/session-card";
import { SessionSelectionToggle } from "@/components/session-selection-toggle";
import { Card } from "@/components/ui/card";
import { requireAttendeeSession } from "@/lib/auth";
import { getAttendeePortal } from "@/lib/data";
import { groupBy } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function GuestAgendaPage() {
  const session = await requireAttendeeSession();
  const attendee = await getAttendeePortal(session.user.attendeeId!);

  if (!attendee) {
    return null;
  }

  const groupedSessions = groupBy(attendee.event.sessions, (item) => new Date(item.startAt).toLocaleDateString("de-DE"));
  const selectedIds = new Set(attendee.sessionSelections.map((selection) => selection.sessionId));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Programm"
        title="Agenda"
        description="Zeiten, Räume und freie Plätze."
      />
      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6a6256]">Veranstaltung</p>
            <p className="mt-1 font-manrope text-3xl font-semibold tracking-[-0.05em] text-[#111315]">{attendee.event.name}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[18px] border border-[#d5ccbf] bg-[#f7f3ed] px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6a6256]">Tage</p>
              <p className="mt-1 font-manrope text-2xl font-semibold tracking-[-0.05em] text-[#111315]">{Object.keys(groupedSessions).length}</p>
            </div>
            <div className="rounded-[18px] border border-[#d5ccbf] bg-[#f7f3ed] px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6a6256]">Mein Plan</p>
              <p className="mt-1 font-manrope text-2xl font-semibold tracking-[-0.05em] text-[#111315]">{selectedIds.size}</p>
            </div>
          </div>
        </div>
      </Card>
      <div className="space-y-8">
        {Object.entries(groupedSessions).map(([day, sessions]) => (
          <section key={day} className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="font-manrope text-3xl tracking-[-0.05em] text-[#111315]">{day}</h2>
              <p className="text-sm text-[#59616a]">{sessions.length} Sessions</p>
            </div>
            <div className="space-y-4">
              {sessions.map((item) => {
                const selected = selectedIds.has(item.id);
                const remainingSeats = item.capacity ? Math.max(item.capacity - item.selections.length, 0) : null;

                return (
                  <div key={item.id} className="space-y-3">
                    <SessionCard
                      title={item.title}
                      subtitle={item.subtitle}
                      description={item.description}
                      timeRange={{ startAt: item.startAt, endAt: item.endAt }}
                      room={item.room?.name}
                      tags={item.tags}
                      featured={item.featured}
                    />
                    {item.selectionEnabled && attendee.event.attendeeSelectionOn ? (
                      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-[#d5ccbf] bg-[#f7f3ed] px-4 py-3">
                        <p className="text-sm text-[#59616a]">
                          {remainingSeats === null ? "Freie Auswahl" : `${remainingSeats} Plätze frei`}
                        </p>
                        <SessionSelectionToggle sessionId={item.id} selected={selected} />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
