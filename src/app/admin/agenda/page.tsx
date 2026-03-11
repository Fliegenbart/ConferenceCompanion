import { deleteSessionAction, saveSessionAction } from "@/actions/admin";
import { PageHeader } from "@/components/page-header";
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
      <PageHeader title="Agenda Management" description="Sessions, Speaker-Zuordnung, Raeume und Kapazitaeten bearbeiten." />
      <SiteSection title="Neue Session">
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
            <Label htmlFor="roomId">Raum ID</Label>
            <Input id="roomId" name="roomId" placeholder={agenda.rooms.map((room) => room.name).join(", ")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacity">Kapazitaet</Label>
            <Input id="capacity" name="capacity" type="number" min="1" />
          </div>
          <div className="xl:col-span-2 grid gap-2 sm:grid-cols-2">
            {agenda.speakers.map((speaker) => (
              <label key={speaker.id} className="flex items-center gap-3 rounded-2xl border border-[#d7dfd3] px-4 py-3 text-sm text-[#284334]">
                <input type="checkbox" name="speakerIds" value={speaker.id} className="size-4 accent-[#da4f29]" />
                {speaker.name}
              </label>
            ))}
          </div>
          <div className="flex gap-6 xl:col-span-2">
            <label className="flex items-center gap-3 text-sm text-[#284334]">
              <input type="checkbox" name="featured" className="size-4 accent-[#da4f29]" />
              Featured
            </label>
            <label className="flex items-center gap-3 text-sm text-[#284334]">
              <input type="checkbox" name="selectionEnabled" defaultChecked className="size-4 accent-[#da4f29]" />
              Auswahl aktiv
            </label>
          </div>
          <div className="xl:col-span-2">
            <SubmitButton>Session speichern</SubmitButton>
          </div>
        </form>
      </SiteSection>
      <SiteSection title="Bestehende Sessions">
        <div className="space-y-4">
          {agenda.sessions.map((item) => (
            <details key={item.id} className="rounded-[24px] border border-[#d9e1d5] bg-white p-5">
              <summary className="cursor-pointer list-none">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-[#173325]">{item.title}</p>
                    <p className="text-sm text-[#5d7065]">{item.room?.name ?? "Raum folgt"} · {new Date(item.startAt).toLocaleString("de-DE")}</p>
                  </div>
                  <p className="text-sm text-[#5d7065]">{item.capacity ? `${item.selections.length}/${item.capacity}` : "ohne Limit"}</p>
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
                  <Label>Raum ID</Label>
                  <Input name="roomId" defaultValue={item.roomId ?? ""} />
                </div>
                <div className="space-y-2">
                  <Label>Kapazitaet</Label>
                  <Input name="capacity" type="number" defaultValue={item.capacity ?? ""} />
                </div>
                <div className="flex gap-6 xl:col-span-2">
                  <label className="flex items-center gap-3 text-sm text-[#284334]">
                    <input type="checkbox" name="featured" defaultChecked={item.featured} className="size-4 accent-[#da4f29]" />
                    Featured
                  </label>
                  <label className="flex items-center gap-3 text-sm text-[#284334]">
                    <input
                      type="checkbox"
                      name="selectionEnabled"
                      defaultChecked={item.selectionEnabled}
                      className="size-4 accent-[#da4f29]"
                    />
                    Auswahl aktiv
                  </label>
                </div>
                <div className="flex flex-wrap gap-3 xl:col-span-2">
                  <SubmitButton>Session aktualisieren</SubmitButton>
                </div>
              </form>
              <form action={deleteSessionFormAction} className="mt-4">
                <input type="hidden" name="id" value={item.id} />
                <SubmitButton variant="destructive">Session loeschen</SubmitButton>
              </form>
            </details>
          ))}
        </div>
      </SiteSection>
    </div>
  );
}
