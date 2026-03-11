import {
  deleteAnnouncementAction,
  deleteDownloadAction,
  deleteFaqAction,
  deleteVenueInfoAction,
  saveAnnouncementAction,
  saveDownloadAction,
  saveFaqAction,
  saveVenueInfoAction,
} from "@/actions/admin";
import { PageHeader } from "@/components/page-header";
import { SubmitButton } from "@/components/submit-button";
import { SiteSection } from "@/components/site-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { requireAdminSession } from "@/lib/auth";
import { getAdminContent } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const session = await requireAdminSession();
  const content = await getAdminContent(session.user.eventId!);

  async function announcementAction(formData: FormData) {
    "use server";
    await saveAnnouncementAction(formData);
  }

  async function announcementDeleteAction(formData: FormData) {
    "use server";
    await deleteAnnouncementAction(formData);
  }

  async function venueAction(formData: FormData) {
    "use server";
    await saveVenueInfoAction(formData);
  }

  async function venueDeleteAction(formData: FormData) {
    "use server";
    await deleteVenueInfoAction(formData);
  }

  async function faqAction(formData: FormData) {
    "use server";
    await saveFaqAction(formData);
  }

  async function faqDeleteAction(formData: FormData) {
    "use server";
    await deleteFaqAction(formData);
  }

  async function downloadAction(formData: FormData) {
    "use server";
    await saveDownloadAction(formData);
  }

  async function downloadDeleteAction(formData: FormData) {
    "use server";
    await deleteDownloadAction(formData);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Content Management" description="Ankuendigungen, Venue-Infos, FAQ und Downloads pflegen." />
      <Tabs defaultValue="announcements">
        <TabsList>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="venue">Venue Info</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
        </TabsList>
        <TabsContent value="announcements" className="space-y-6">
          <SiteSection title="Neue Ankuendigung">
            <form action={announcementAction} className="grid gap-4">
              <div className="space-y-2">
                <Label>Titel</Label>
                <Input name="title" required />
              </div>
              <div className="space-y-2">
                <Label>Nachricht</Label>
                <Textarea name="body" required />
              </div>
              <div className="space-y-2">
                <Label>Audience</Label>
                <Input name="audience" defaultValue="all" />
              </div>
              <label className="flex items-center gap-3 text-sm text-[#284334]">
                <input type="checkbox" name="pinned" className="size-4 accent-[#da4f29]" />
                Als Highlight anpinnen
              </label>
              <SubmitButton>Ankuendigung speichern</SubmitButton>
            </form>
          </SiteSection>
          <SiteSection title="Bestehende Ankuendigungen">
            <div className="space-y-4">
              {content.announcements.map((item) => (
                <form key={item.id} action={announcementAction} className="space-y-4 rounded-[24px] border border-[#d9e1d5] bg-white p-5">
                  <input type="hidden" name="id" value={item.id} />
                  <Input name="title" defaultValue={item.title} required />
                  <Textarea name="body" defaultValue={item.body} required />
                  <Input name="audience" defaultValue={item.audience} />
                  <label className="flex items-center gap-3 text-sm text-[#284334]">
                    <input type="checkbox" name="pinned" defaultChecked={item.pinned} className="size-4 accent-[#da4f29]" />
                    Pinned
                  </label>
                  <div className="flex gap-3">
                    <SubmitButton>Aktualisieren</SubmitButton>
                  </div>
                  <div>
                    <button
                      type="submit"
                      formAction={announcementDeleteAction}
                      className="inline-flex h-11 items-center justify-center rounded-full bg-[#8f2f20] px-5 text-sm font-semibold text-white"
                    >
                      Ankuendigung loeschen
                    </button>
                  </div>
                </form>
              ))}
            </div>
          </SiteSection>
        </TabsContent>
        <TabsContent value="venue" className="space-y-6">
          <SiteSection title="Venue Info hinzufuegen">
            <form action={venueAction} className="grid gap-4 md:grid-cols-2">
              <Input name="key" placeholder="Key" required />
              <Input name="title" placeholder="Titel" required />
              <Input name="sortOrder" type="number" placeholder="Sortierung" />
              <div className="md:col-span-2">
                <Textarea name="content" placeholder="Text" required />
              </div>
              <SubmitButton>Venue Info speichern</SubmitButton>
            </form>
          </SiteSection>
          <SiteSection title="Bestehende Venue Infos">
            <div className="space-y-4">
              {content.venueInfo.map((item) => (
                <div key={item.id} className="rounded-[24px] border border-[#d9e1d5] bg-white p-5">
                  <form action={venueAction} className="grid gap-4 md:grid-cols-2">
                    <input type="hidden" name="id" value={item.id} />
                    <Input name="key" defaultValue={item.key} required />
                    <Input name="title" defaultValue={item.title} required />
                    <Input name="sortOrder" type="number" defaultValue={item.sortOrder} />
                    <div className="md:col-span-2">
                      <Textarea name="content" defaultValue={item.content} required />
                    </div>
                    <SubmitButton>Aktualisieren</SubmitButton>
                  </form>
                  <form action={venueDeleteAction} className="mt-3">
                    <input type="hidden" name="id" value={item.id} />
                    <SubmitButton variant="destructive">Loeschen</SubmitButton>
                  </form>
                </div>
              ))}
            </div>
          </SiteSection>
        </TabsContent>
        <TabsContent value="faq" className="space-y-6">
          <SiteSection title="FAQ anlegen">
            <form action={faqAction} className="grid gap-4">
              <Input name="question" placeholder="Frage" required />
              <Textarea name="answer" placeholder="Antwort" required />
              <Input name="sortOrder" type="number" placeholder="Sortierung" />
              <SubmitButton>FAQ speichern</SubmitButton>
            </form>
          </SiteSection>
          <SiteSection title="Bestehende FAQs">
            <div className="space-y-4">
              {content.faqItems.map((item) => (
                <div key={item.id} className="rounded-[24px] border border-[#d9e1d5] bg-white p-5">
                  <form action={faqAction} className="space-y-4">
                    <input type="hidden" name="id" value={item.id} />
                    <Input name="question" defaultValue={item.question} required />
                    <Textarea name="answer" defaultValue={item.answer} required />
                    <Input name="sortOrder" type="number" defaultValue={item.sortOrder} />
                    <SubmitButton>Aktualisieren</SubmitButton>
                  </form>
                  <form action={faqDeleteAction} className="mt-3">
                    <input type="hidden" name="id" value={item.id} />
                    <SubmitButton variant="destructive">Loeschen</SubmitButton>
                  </form>
                </div>
              ))}
            </div>
          </SiteSection>
        </TabsContent>
        <TabsContent value="downloads" className="space-y-6">
          <SiteSection title="Download anlegen">
            <form action={downloadAction} className="grid gap-4 md:grid-cols-2">
              <Input name="title" placeholder="Titel" required />
              <Input name="fileName" placeholder="Dateiname" required />
              <Input name="category" placeholder="Kategorie" />
              <Input name="fileUrl" placeholder="/docs/datei.pdf" required />
              <div className="md:col-span-2">
                <Textarea name="description" placeholder="Beschreibung" />
              </div>
              <SubmitButton>Download speichern</SubmitButton>
            </form>
          </SiteSection>
          <SiteSection title="Bestehende Downloads">
            <div className="space-y-4">
              {content.downloads.map((item) => (
                <div key={item.id} className="rounded-[24px] border border-[#d9e1d5] bg-white p-5">
                  <form action={downloadAction} className="grid gap-4 md:grid-cols-2">
                    <input type="hidden" name="id" value={item.id} />
                    <Input name="title" defaultValue={item.title} required />
                    <Input name="fileName" defaultValue={item.fileName} required />
                    <Input name="category" defaultValue={item.category ?? ""} />
                    <Input name="fileUrl" defaultValue={item.fileUrl} required />
                    <div className="md:col-span-2">
                      <Textarea name="description" defaultValue={item.description ?? ""} />
                    </div>
                    <SubmitButton>Aktualisieren</SubmitButton>
                  </form>
                  <form action={downloadDeleteAction} className="mt-3">
                    <input type="hidden" name="id" value={item.id} />
                    <SubmitButton variant="destructive">Loeschen</SubmitButton>
                  </form>
                </div>
              ))}
            </div>
          </SiteSection>
        </TabsContent>
      </Tabs>
    </div>
  );
}
