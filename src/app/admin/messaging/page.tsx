import { sendAudienceMessageAction } from "@/actions/admin";
import { PageHeader } from "@/components/page-header";
import { SiteSection } from "@/components/site-section";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { requireAdminSession } from "@/lib/auth";
import { getMessagingData } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminMessagingPage() {
  const session = await requireAdminSession();
  const messaging = await getMessagingData(session.user.eventId!);

  async function messageAction(formData: FormData) {
    "use server";
    await sendAudienceMessageAction(formData);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Messaging" description="Updates an alle oder segmentierte Attendee-Gruppen versenden." />
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SiteSection title="Broadcast versenden">
          <form action={messageAction} className="space-y-4">
            <div className="space-y-2">
              <Label>Betreff</Label>
              <Input name="subject" required />
            </div>
            <div className="space-y-2">
              <Label>Audience</Label>
              <Input name="audience" defaultValue="all" />
            </div>
            <div className="space-y-2">
              <Label>Nachricht</Label>
              <Textarea name="body" required />
            </div>
            <SubmitButton>Update versenden</SubmitButton>
          </form>
        </SiteSection>
        <SiteSection title="Audience Snapshot">
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(messaging.audiences).map(([key, value]) => (
              <div key={key} className="rounded-[24px] border border-[#d9e1d5] bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#708177]">{key}</p>
                <p className="mt-2 text-3xl font-semibold text-[#173325]">{value}</p>
              </div>
            ))}
          </div>
        </SiteSection>
      </div>
      <SiteSection title="Nachrichtenhistorie">
        <div className="space-y-3">
          {messaging.logs.map((log) => (
            <div key={log.id} className="rounded-[24px] border border-[#d9e1d5] bg-white p-4">
              <p className="font-semibold text-[#173325]">{log.subject}</p>
              <p className="text-sm text-[#5d7065]">{log.recipient}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#708177]">
                {log.type} · {log.status}
              </p>
            </div>
          ))}
        </div>
      </SiteSection>
    </div>
  );
}
