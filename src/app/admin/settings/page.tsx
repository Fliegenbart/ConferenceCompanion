import { Link2, ShieldCheck, ToggleLeft } from "lucide-react";

import { updateEventSettingsAction } from "@/actions/admin";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { SiteSection } from "@/components/site-section";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { requireAdminSession } from "@/lib/auth";
import { getAdminContent } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await requireAdminSession();
  const content = await getAdminContent(session.user.eventId!);

  async function settingsAction(formData: FormData) {
    "use server";
    await updateEventSettingsAction(formData);
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Einstellungen" title="Registrierung einstellen" description="Anmeldung und Rechtstexte festlegen." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Registrierung" value={content.event.registrationOpen ? "Offen" : "Geschlossen"} icon={ToggleLeft} hint="im Formular" />
        <StatCard label="Auswahl" value={content.event.attendeeSelectionOn ? "Aktiv" : "Aus"} icon={ShieldCheck} hint="bei der Anmeldung" />
        <StatCard label="Links" value={[content.event.privacyPolicyUrl, content.event.legalNoticeUrl].filter(Boolean).length} icon={Link2} hint="verlinkte Seiten" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.04fr_0.96fr]">
        <SiteSection title="Einstellungen" description="Formular für Gäste steuern.">
          <form action={settingsAction} className="space-y-5">
            <label className="flex items-center gap-3 text-sm text-[#16181a]">
              <input type="checkbox" name="registrationOpen" defaultChecked={content.event.registrationOpen} className="size-4 accent-[#111315]" />
              Registrierung geöffnet
            </label>
            <label className="flex items-center gap-3 text-sm text-[#16181a]">
              <input
                type="checkbox"
                name="attendeeSelectionOn"
                defaultChecked={content.event.attendeeSelectionOn}
                className="size-4 accent-[#111315]"
              />
              Sitzungsauswahl aktiviert
            </label>
            <div className="space-y-2">
              <Label>Bestätigungstext</Label>
              <Textarea name="confirmationText" defaultValue={content.event.confirmationText ?? ""} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Datenschutz-URL</Label>
                <Input name="privacyPolicyUrl" defaultValue={content.event.privacyPolicyUrl ?? "/privacy-policy"} />
              </div>
              <div className="space-y-2">
                <Label>Rechtliche-URL</Label>
                <Input name="legalNoticeUrl" defaultValue={content.event.legalNoticeUrl ?? "/legal"} />
              </div>
            </div>
            <SubmitButton>Einstellungen speichern</SubmitButton>
          </form>
        </SiteSection>
        <SiteSection title="Aktuelle Wirkung" description="Das sehen Gäste gerade.">
          <div className="grid gap-3">
            {[
              { label: "Registrierung", value: content.event.registrationOpen ? "Gäste können sich registrieren" : "Registrierung ist geschlossen" },
              { label: "Sessionwahl", value: content.event.attendeeSelectionOn ? "Gäste sehen auswählbare Sessions" : "Keine Sessionwahl im Formular" },
              { label: "Datenschutz", value: content.event.privacyPolicyUrl ?? "/privacy-policy" },
              { label: "Rechtliches", value: content.event.legalNoticeUrl ?? "/legal" },
            ].map((item) => (
              <div key={item.label} className="rounded-[18px] border border-[#ddd6cb] bg-[#f7f3ed] px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6a6256]">{item.label}</p>
                <p className="mt-2 text-sm leading-6 text-[#111315]">{item.value}</p>
              </div>
            ))}
          </div>
        </SiteSection>
      </div>
    </div>
  );
}
