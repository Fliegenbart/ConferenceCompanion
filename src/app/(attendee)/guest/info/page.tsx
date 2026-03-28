import { PageHeader } from "@/components/page-header";
import { SiteSection } from "@/components/site-section";
import { Card } from "@/components/ui/card";
import { requireAttendeeSession } from "@/lib/auth";
import { getAttendeePortal } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function EventInfoPage() {
  const session = await requireAttendeeSession();
  const attendee = await getAttendeePortal(session.user.attendeeId!);

  if (!attendee) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Infos"
        title="Event-Info"
        description="Anreise, Hotel, WLAN und Antworten."
      />
      <Card className="bg-[#f7f3ed]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6a6256]">Auf einen Blick</p>
        <p className="mt-2 text-sm leading-6 text-[#59616a]">
          Adresse, Hotel, Shuttle und WLAN.
        </p>
      </Card>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="space-y-6">
          <SiteSection title="Logistik">
            <div className="grid gap-4">
              {attendee.event.venueInfo.map((item) => (
                <div key={item.id} className="rounded-[18px] border border-[#d5ccbf] bg-[#f7f3ed] p-4">
                  <h3 className="font-medium text-[#111315]">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#59616a]">{item.content}</p>
                </div>
              ))}
            </div>
          </SiteSection>
        </div>
        <SiteSection title="Häufige Fragen">
          <div className="space-y-4">
            {attendee.event.faqItems.map((item) => (
              <details key={item.id} className="rounded-[18px] border border-[#d5ccbf] bg-[#f7f3ed] p-4">
                <summary className="cursor-pointer font-medium text-[#111315]">{item.question}</summary>
                <p className="mt-3 text-sm leading-6 text-[#59616a]">{item.answer}</p>
              </details>
            ))}
          </div>
        </SiteSection>
      </div>
    </div>
  );
}
