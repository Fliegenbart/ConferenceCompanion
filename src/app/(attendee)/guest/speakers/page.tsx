import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { requireAttendeeSession } from "@/lib/auth";
import { getAttendeePortal } from "@/lib/data";
import { initials } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SpeakersPage() {
  const session = await requireAttendeeSession();
  const attendee = await getAttendeePortal(session.user.attendeeId!);

  if (!attendee) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Speaker" description="Profilkarten, Rollenbeschreibungen und Bezuge zur Agenda." />
      <div className="grid gap-4 lg:grid-cols-2">
        {attendee.event.speakers.map((speaker) => (
          <Card key={speaker.id} className="space-y-4 p-5">
            <div className="flex items-center gap-4">
              <Avatar className="size-16">
                <AvatarImage src={speaker.imageUrl ?? undefined} alt={speaker.name} />
                <AvatarFallback>{initials(speaker.name.split(" ")[0], speaker.name.split(" ")[1])}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl text-[#173325]">{speaker.name}</h2>
                <p className="text-sm text-[#5f7267]">{speaker.role}</p>
                {speaker.company ? <p className="text-sm text-[#5f7267]">{speaker.company}</p> : null}
              </div>
            </div>
            <p className="text-sm leading-7 text-[#4b6155]">{speaker.bio}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
