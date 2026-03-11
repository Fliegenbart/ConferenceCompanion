import { PageHeader } from "@/components/page-header";
import { SiteSection } from "@/components/site-section";
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
      <PageHeader title="Event Informationen" description="Venue, Anreise, Hotel, WLAN, Dress Code und Ansprechpartner." />
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="space-y-6">
          <SiteSection title="Logistik">
            <div className="grid gap-4">
              {attendee.event.venueInfo.map((item) => (
                <div key={item.id} className="rounded-[24px] border border-[#d9e1d5] bg-[#f8faf6] p-4">
                  <h3 className="font-semibold text-[#173325]">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#495f53]">{item.content}</p>
                </div>
              ))}
            </div>
          </SiteSection>
        </div>
        <SiteSection title="FAQ">
          <div className="space-y-4">
            {attendee.event.faqItems.map((item) => (
              <details key={item.id} className="rounded-[24px] border border-[#d9e1d5] bg-white p-4">
                <summary className="cursor-pointer font-medium text-[#173325]">{item.question}</summary>
                <p className="mt-3 text-sm leading-6 text-[#4f6559]">{item.answer}</p>
              </details>
            ))}
          </div>
        </SiteSection>
      </div>
    </div>
  );
}
