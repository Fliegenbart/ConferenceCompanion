import { updateEventSettingsAction } from "@/actions/admin";
import { PageHeader } from "@/components/page-header";
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
      <PageHeader title="Registration Settings" description="Steuerung von Registrierung, Consent-Texten und rechtlichen Verlinkungen." />
      <SiteSection title="Event Einstellungen">
        <form action={settingsAction} className="space-y-5">
          <label className="flex items-center gap-3 text-sm text-[#284334]">
            <input type="checkbox" name="registrationOpen" defaultChecked={content.event.registrationOpen} className="size-4 accent-[#da4f29]" />
            Registrierung geoeffnet
          </label>
          <label className="flex items-center gap-3 text-sm text-[#284334]">
            <input
              type="checkbox"
              name="attendeeSelectionOn"
              defaultChecked={content.event.attendeeSelectionOn}
              className="size-4 accent-[#da4f29]"
            />
            Session-Auswahl aktiviert
          </label>
          <div className="space-y-2">
            <Label>Confirmation Text</Label>
            <Textarea name="confirmationText" defaultValue={content.event.confirmationText ?? ""} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Privacy URL</Label>
              <Input name="privacyPolicyUrl" defaultValue={content.event.privacyPolicyUrl ?? "/privacy-policy"} />
            </div>
            <div className="space-y-2">
              <Label>Legal URL</Label>
              <Input name="legalNoticeUrl" defaultValue={content.event.legalNoticeUrl ?? "/legal"} />
            </div>
          </div>
          <SubmitButton>Einstellungen speichern</SubmitButton>
        </form>
      </SiteSection>
    </div>
  );
}
