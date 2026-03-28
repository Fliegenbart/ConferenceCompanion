import { Bell, Send, Users } from "lucide-react";

import { sendAudienceMessageAction } from "@/actions/admin";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
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
  const totalAudience = Object.values(messaging.audiences).reduce((sum, current) => sum + current, 0);

  async function messageAction(formData: FormData) {
    "use server";
    await sendAudienceMessageAction(formData);
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Kommunikation" title="Nachrichten" description="Mitteilungen an Gruppen senden." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Empfänger" value={totalAudience} icon={Users} hint="über alle Listen" />
        <StatCard label="Gruppen" value={Object.keys(messaging.audiences).length} icon={Bell} hint="für Nachrichten" />
        <StatCard label="Gesendet" value={messaging.logs.length} icon={Send} hint="zuletzt verschickt" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SiteSection title="Nachricht senden" description="Betreff, Gruppe und Nachricht.">
          <form action={messageAction} className="space-y-4">
            <div className="space-y-2">
              <Label>Betreff</Label>
              <Input name="subject" required />
            </div>
            <div className="space-y-2">
              <Label>Zielgruppe</Label>
              <Input name="audience" defaultValue="all" />
            </div>
            <div className="space-y-2">
              <Label>Nachricht</Label>
              <Textarea name="body" required />
            </div>
            <SubmitButton>Mitteilung versenden</SubmitButton>
          </form>
        </SiteSection>
        <SiteSection title="Empfänger" description="Anzahl je Gruppe.">
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(messaging.audiences).map(([key, value]) => (
              <div key={key} className="rounded-[20px] border border-[#e2dbd0] bg-[#fbf8f3] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b7279]">{key}</p>
                <p className="mt-2 font-manrope text-3xl font-semibold text-[#111315]">{value}</p>
              </div>
            ))}
          </div>
        </SiteSection>
      </div>
      <SiteSection title="Zuletzt verschickt" description="Letzte Mitteilungen.">
        <div className="space-y-3">
          {messaging.logs.map((log) => (
            <div key={log.id} className="rounded-[20px] border border-[#e2dbd0] bg-white p-4">
              <p className="font-medium text-[#111315]">{log.subject}</p>
              <p className="text-sm text-[#5d646b]">{log.recipient}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#7b8187]">
                {log.type} · {log.status}
              </p>
            </div>
          ))}
        </div>
      </SiteSection>
    </div>
  );
}
