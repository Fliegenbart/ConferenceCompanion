import { CalendarCheck2 } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { SessionCard } from "@/components/session-card";
import { requireAttendeeSession } from "@/lib/auth";
import { getAttendeePortal } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function MyAgendaPage() {
  const session = await requireAttendeeSession();
  const attendee = await getAttendeePortal(session.user.attendeeId!);

  if (!attendee) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Meine Agenda" description="Ihre ausgewaehlten Formate und persoenlichen Programmpunkte." />
      {attendee.sessionSelections.length ? (
        <div className="space-y-4">
          {attendee.sessionSelections.map((selection) => (
            <SessionCard
              key={selection.id}
              title={selection.session.title}
              subtitle={selection.session.subtitle}
              description={selection.session.description}
              timeRange={{ startAt: selection.session.startAt, endAt: selection.session.endAt }}
              room={selection.session.room?.name}
              tags={selection.session.tags}
              featured={selection.session.featured}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CalendarCheck2}
          title="Noch keine Sessions ausgewaehlt"
          description="Sobald Sie Workshops oder Breakouts waehlen, erscheinen sie hier in Ihrer persoenlichen Agenda."
        />
      )}
    </div>
  );
}
