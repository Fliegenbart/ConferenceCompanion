import { CalendarRange, MapPinned, Mic2, Star } from "lucide-react";

import { deleteSessionAction, saveSessionAction } from "@/actions/admin";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { SubmitButton } from "@/components/submit-button";
import { SiteSection } from "@/components/site-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { requireAdminSession } from "@/lib/auth";
import { getAdminAgenda } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminAgendaPage() {
  const session = await requireAdminSession();
  const agenda = await getAdminAgenda(session.user.eventId!);
  const featuredCount = agenda.sessions.filter((item) => item.featured).length;

  async function saveSessionFormAction(formData: FormData) {
    "use server";
    await saveSessionAction(formData);
  }

  async function deleteSessionFormAction(formData: FormData) {
    "use server";
    await deleteSessionAction(formData);
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Agenda" title="Programm bearbeiten" description="Programm, Räume und Plätze pflegen." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Sessions" value={agenda.sessions.length} icon={CalendarRange} hint="im Programm" />
        <StatCard label="Räume" value={agenda.rooms.length} icon={MapPinned} hint="für Sessions" />
        <StatCard label="Referenten" value={agenda.speakers.length} icon={Mic2} hint="für die Zuordnung" />
        <StatCard label="Highlights" value={featuredCount} icon={Star} hint="markierte Sessions" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <SiteSection title="Neue Session" description="Titel, Zeit und Raum eintragen.">
          <form action={saveSessionFormAction} className="grid gap-4 xl:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Titel</Label>
              <Input id="title" name="title" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Untertitel</Label>
              <Input id="subtitle" name="subtitle" />
            </div>
            <div className="space-y-2 xl:col-span-2">
              <Label htmlFor="description">Beschreibung</Label>
              <Textarea id="description" name="description" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Kategorie</Label>
              <Input id="category" name="category" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (kommagetrennt)</Label>
              <Input id="tags" name="tags" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startAt">Start</Label>
              <Input id="startAt" name="startAt" type="datetime-local" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endAt">Ende</Label>
              <Input id="endAt" name="endAt" type="datetime-local" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roomId">Raum-ID</Label>
              <Input id="roomId" name="roomId" placeholder={agenda.rooms.map((room) => room.name).join(", ")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Kapazität</Label>
              <Input id="capacity" name="capacity" type="number" min="1" />
            </div>
            <div className="xl:col-span-2 grid gap-2 sm:grid-cols-2">
              {agenda.speakers.map((speaker) => (
                <label key={speaker.id} className="flex items-center gap-3 rounded-[18px] border border-[#ddd6cb] bg-[#f7f3ed] px-4 py-3 text-sm text-[#16181a]">
                  <input type="checkbox" name="speakerIds" value={speaker.id} className="size-4 accent-[#111315]" />
                  {speaker.name}
                </label>
              ))}
            </div>
            <div className="flex gap-6 xl:col-span-2">
              <label className="flex items-center gap-3 text-sm text-[#16181a]">
                <input type="checkbox" name="featured" className="size-4 accent-[#111315]" />
                Hervorgehoben
              </label>
              <label className="flex items-center gap-3 text-sm text-[#16181a]">
                <input type="checkbox" name="selectionEnabled" defaultChecked className="size-4 accent-[#111315]" />
                Auswahl aktiv
              </label>
            </div>
            <div className="xl:col-span-2">
              <SubmitButton>Sitzung speichern</SubmitButton>
            </div>
          </form>
        </SiteSection>
        <SiteSection title="Räume und Referenten" description="Namen und IDs für die Zuordnung.">
          <div className="space-y-4">
            <div className="rounded-[18px] border border-[#ddd6cb] bg-[#f7f3ed] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6a6256]">Räume</p>
              <div className="mt-3 grid gap-2">
                {agenda.rooms.map((room) => (
                  <div key={room.id} className="flex items-center justify-between rounded-[14px] bg-white px-3 py-3 text-sm">
                    <span className="font-medium text-[#111315]">{room.name}</span>
                    <span className="text-[#59616a]">{room.id}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[18px] border border-[#ddd6cb] bg-[#f7f3ed] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6a6256]">Referenten</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {agenda.speakers.map((speaker) => (
                  <span key={speaker.id} className="rounded-full border border-[#ddd6cb] bg-white px-3 py-2 text-sm text-[#111315]">
                    {speaker.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </SiteSection>
      </div>
      <SiteSection title="Sessions" description="Bestehende Programmpunkte pflegen.">
        <div className="space-y-4">
          {agenda.sessions.map((item) => (
            <details key={item.id} className="rounded-[20px] border border-[#e2dbd0] bg-white p-5">
              <summary className="cursor-pointer list-none">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium text-[#111315]">{item.title}</p>
                    <p className="text-sm text-[#5d646b]">
                      {item.room?.name ?? "Raum folgt"} · {new Date(item.startAt).toLocaleString("de-DE")}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.featured ? <span className="rounded-full bg-[#ece6de] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#17191c]">Highlight</span> : null}
                      {item.selectionEnabled ? (
                        <span className="rounded-full bg-[#e3ebe8] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#255447]">Auswahl aktiv</span>
                      ) : null}
                    </div>
                  </div>
                  <p className="text-sm text-[#5d646b]">{item.capacity ? `${item.selections.length}/${item.capacity}` : "ohne Limit"}</p>
                </div>
              </summary>
              <form action={saveSessionFormAction} className="mt-5 grid gap-4 xl:grid-cols-2">
                <input type="hidden" name="id" value={item.id} />
                <div className="space-y-2">
                  <Label>Titel</Label>
                  <Input name="title" defaultValue={item.title} required />
                </div>
                <div className="space-y-2">
                  <Label>Untertitel</Label>
                  <Input name="subtitle" defaultValue={item.subtitle ?? ""} />
                </div>
                <div className="space-y-2 xl:col-span-2">
                  <Label>Beschreibung</Label>
                  <Textarea name="description" defaultValue={item.description} required />
                </div>
                <div className="space-y-2">
                  <Label>Kategorie</Label>
                  <Input name="category" defaultValue={item.category ?? ""} />
                </div>
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <Input name="tags" defaultValue={item.tags.join(", ")} />
                </div>
                <div className="space-y-2">
                  <Label>Start</Label>
                  <Input name="startAt" type="datetime-local" defaultValue={new Date(item.startAt).toISOString().slice(0, 16)} required />
                </div>
                <div className="space-y-2">
                  <Label>Ende</Label>
                  <Input name="endAt" type="datetime-local" defaultValue={new Date(item.endAt).toISOString().slice(0, 16)} required />
                </div>
                <div className="space-y-2">
                  <Label>Raum-ID</Label>
                  <Input name="roomId" defaultValue={item.roomId ?? ""} />
                </div>
                <div className="space-y-2">
                  <Label>Kapazität</Label>
                  <Input name="capacity" type="number" defaultValue={item.capacity ?? ""} />
                </div>
                <div className="flex gap-6 xl:col-span-2">
                  <label className="flex items-center gap-3 text-sm text-[#16181a]">
                    <input type="checkbox" name="featured" defaultChecked={item.featured} className="size-4 accent-[#111315]" />
                    Hervorgehoben
                  </label>
                  <label className="flex items-center gap-3 text-sm text-[#16181a]">
                    <input
                      type="checkbox"
                      name="selectionEnabled"
                      defaultChecked={item.selectionEnabled}
                      className="size-4 accent-[#111315]"
                    />
                    Auswahl aktiv
                  </label>
                </div>
                <div className="flex flex-wrap gap-3 xl:col-span-2">
                  <SubmitButton>Sitzung aktualisieren</SubmitButton>
                </div>
              </form>
              <form action={deleteSessionFormAction} className="mt-4">
                <input type="hidden" name="id" value={item.id} />
                <SubmitButton variant="destructive">Sitzung löschen</SubmitButton>
              </form>
            </details>
          ))}
        </div>
      </SiteSection>
    </div>
  );
}
