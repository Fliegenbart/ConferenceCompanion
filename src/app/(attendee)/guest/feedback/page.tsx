import { FeedbackType } from "@prisma/client";

import { FeedbackForm } from "@/components/forms/feedback-form";
import { PageHeader } from "@/components/page-header";
import { requireAttendeeSession } from "@/lib/auth";
import { getAttendeePortal } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function FeedbackPage() {
  const session = await requireAttendeeSession();
  const attendee = await getAttendeePortal(session.user.attendeeId!);

  if (!attendee) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Feedback" description="Gesamtfeedback und optionales Session-Feedback fuer die Veranstaltungsnachbereitung." />
      <div className="space-y-4">
        <FeedbackForm attendeeId={attendee.id} type={FeedbackType.EVENT} title="Gesamtfeedback zur Veranstaltung" />
        {attendee.sessionSelections.map((selection) => (
          <FeedbackForm
            key={selection.id}
            attendeeId={attendee.id}
            type={FeedbackType.SESSION}
            sessionId={selection.sessionId}
            title={`Session Feedback: ${selection.session.title}`}
          />
        ))}
      </div>
    </div>
  );
}
