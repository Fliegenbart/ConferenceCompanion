import { AnnouncementFeed } from "@/components/announcement-feed";
import { PageHeader } from "@/components/page-header";
import { requireAttendeeSession } from "@/lib/auth";
import { getAttendeePortal } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function UpdatesPage() {
  const session = await requireAttendeeSession();
  const attendee = await getAttendeePortal(session.user.attendeeId!);

  if (!attendee) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Aktuell" title="Mitteilungen" description="Wichtige Hinweise für Ihren Besuch." />
      <AnnouncementFeed items={attendee.event.announcements} />
    </div>
  );
}
