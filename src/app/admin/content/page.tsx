import { Bell, CircleHelp, Download, MapPinned } from "lucide-react";

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
import { StatCard } from "@/components/stat-card";
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
      <PageHeader eyebrow="Inhalte" title="Inhalte bearbeiten" description="Updates, Anreise, FAQ und Dateien." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Updates" value={content.announcements.length} icon={Bell} hint="sichtbar für Gäste" />
        <StatCard label="Anreise" value={content.venueInfo.length} icon={MapPinned} hint="Infos zu Ort und Ablauf" />
        <StatCard label="FAQ" value={content.faqItems.length} icon={CircleHelp} hint="Antworten für Gäste" />
        <StatCard label="Downloads" value={content.downloads.length} icon={Download} hint="Dateien für Gäste" />
      </div>
      <Tabs defaultValue="announcements">
        <TabsList>
          <TabsTrigger value="announcements">Updates</TabsTrigger>
          <TabsTrigger value="venue">Anreise</TabsTrigger>
          <TabsTrigger value="faq">Häufige Fragen</TabsTrigger>
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
        </TabsList>
        <TabsContent value="announcements" className="space-y-6">
          <SiteSection title="Update anlegen" description="Wird in der App angezeigt.">
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
                <Label>Zielgruppe</Label>
                <Input name="audience" defaultValue="all" />
              </div>
              <label className="flex items-center gap-3 text-sm text-[#16181a]">
                <input type="checkbox" name="pinned" className="size-4 accent-[#111315]" />
                Als Highlight anpinnen
              </label>
              <SubmitButton>Ankündigung speichern</SubmitButton>
            </form>
          </SiteSection>
          <SiteSection title="Updates" description="Sichtbare Meldungen pflegen.">
            <div className="space-y-4">
              {content.announcements.map((item) => (
                <form key={item.id} action={announcementAction} className="space-y-4 rounded-[20px] border border-[#e2dbd0] bg-white p-5">
                  <input type="hidden" name="id" value={item.id} />
                  <Input name="title" defaultValue={item.title} required />
                  <Textarea name="body" defaultValue={item.body} required />
                  <Input name="audience" defaultValue={item.audience} />
                  <label className="flex items-center gap-3 text-sm text-[#16181a]">
                    <input type="checkbox" name="pinned" defaultChecked={item.pinned} className="size-4 accent-[#111315]" />
                    Angepinnt
                  </label>
                  <div className="flex gap-3">
                    <SubmitButton>Aktualisieren</SubmitButton>
                  </div>
                  <div>
                    <button
                      type="submit"
                      formAction={announcementDeleteAction}
                      className="inline-flex h-11 items-center justify-center rounded-[14px] bg-[#8f2f20] px-5 text-sm font-semibold text-white"
                    >
                      Ankündigung löschen
                    </button>
                  </div>
                </form>
              ))}
            </div>
          </SiteSection>
        </TabsContent>
        <TabsContent value="venue" className="space-y-6">
          <SiteSection title="Anreise anlegen" description="Text für Anreise und Orientierung.">
            <form action={venueAction} className="grid gap-4 md:grid-cols-2">
              <Input name="key" placeholder="Schlüssel" required />
              <Input name="title" placeholder="Titel" required />
              <Input name="sortOrder" type="number" placeholder="Sortierung" />
              <div className="md:col-span-2">
                <Textarea name="content" placeholder="Text" required />
              </div>
              <SubmitButton>Ort und Anreise speichern</SubmitButton>
            </form>
          </SiteSection>
          <SiteSection title="Anreiseblöcke" description="Vor dem Termin sichtbar.">
            <div className="space-y-4">
              {content.venueInfo.map((item) => (
                <div key={item.id} className="rounded-[20px] border border-[#e2dbd0] bg-white p-5">
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
                    <SubmitButton variant="destructive">Löschen</SubmitButton>
                  </form>
                </div>
              ))}
            </div>
          </SiteSection>
        </TabsContent>
        <TabsContent value="faq" className="space-y-6">
          <SiteSection title="Frage anlegen" description="Wird in den häufigen Fragen gezeigt.">
            <form action={faqAction} className="grid gap-4">
              <Input name="question" placeholder="Frage" required />
              <Textarea name="answer" placeholder="Antwort" required />
              <Input name="sortOrder" type="number" placeholder="Sortierung" />
              <SubmitButton>Häufige Fragen speichern</SubmitButton>
            </form>
          </SiteSection>
          <SiteSection title="Fragen" description="Antworten pflegen.">
            <div className="space-y-4">
              {content.faqItems.map((item) => (
                <div key={item.id} className="rounded-[20px] border border-[#e2dbd0] bg-white p-5">
                  <form action={faqAction} className="space-y-4">
                    <input type="hidden" name="id" value={item.id} />
                    <Input name="question" defaultValue={item.question} required />
                    <Textarea name="answer" defaultValue={item.answer} required />
                    <Input name="sortOrder" type="number" defaultValue={item.sortOrder} />
                    <SubmitButton>Aktualisieren</SubmitButton>
                  </form>
                  <form action={faqDeleteAction} className="mt-3">
                    <input type="hidden" name="id" value={item.id} />
                    <SubmitButton variant="destructive">Löschen</SubmitButton>
                  </form>
                </div>
              ))}
            </div>
          </SiteSection>
        </TabsContent>
        <TabsContent value="downloads" className="space-y-6">
          <SiteSection title="Download anlegen" description="Datei für Gäste bereitstellen.">
            <form action={downloadAction} className="grid gap-4 md:grid-cols-2">
              <Input name="title" placeholder="Titel" required />
              <Input name="fileName" placeholder="Dateiname" required />
              <Input name="category" placeholder="Kategorie" />
              <Input name="fileUrl" placeholder="/docs/datei.pdf" required />
              <div className="md:col-span-2">
                <Textarea name="description" placeholder="Beschreibung" />
              </div>
              <SubmitButton>Unterlage speichern</SubmitButton>
            </form>
          </SiteSection>
          <SiteSection title="Downloads" description="Dateien und Beschreibungen pflegen.">
            <div className="space-y-4">
              {content.downloads.map((item) => (
                <div key={item.id} className="rounded-[20px] border border-[#e2dbd0] bg-white p-5">
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
                    <SubmitButton variant="destructive">Löschen</SubmitButton>
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
