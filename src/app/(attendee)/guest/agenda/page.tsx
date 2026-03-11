import { PageHeader } from "@/components/page-header";
import { SessionCard } from "@/components/session-card";
import { SessionSelectionToggle } from "@/components/session-selection-toggle";
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
      <PageHeader title="Agenda" description="Vollstaendiger Veranstaltungsplan mit parallelen Formaten und Session-Auswahl." />
      <div className="space-y-8">
        {Object.entries(groupedSessions).map(([day, sessions]) => (
          <section key={day} className="space-y-4">
            <h2 className="text-2xl text-[#173325]">{day}</h2>
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
                      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-[#d7dfd3] bg-white px-4 py-3">
                        <p className="text-sm text-[#5d7065]">
                          {remainingSeats === null ? "Freie Auswahl" : `${remainingSeats} verfuegbare Plaetze`}
                        </p>
                        <SessionSelectionToggle attendeeId={attendee.id} sessionId={item.id} selected={selected} />
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
