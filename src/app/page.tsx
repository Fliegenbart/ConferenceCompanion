import Link from "next/link";
import { CalendarRange, ClipboardCheck, MapPinned, ShieldCheck } from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentEvent } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Home() {
  const event = await getCurrentEvent();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#dfe8da_0%,#eef2ec_45%,#f6f4ee_100%)] px-4 py-6 md:px-6">
      <main className="mx-auto max-w-7xl space-y-8">
        <div className="glass-panel rounded-[36px] border border-[#d7e0d3] px-6 py-6 shadow-lg md:px-8">
          <div className="mb-12 flex flex-wrap items-center justify-between gap-4">
            <BrandMark />
            <div className="flex flex-wrap gap-3">
              <Button variant="ghost" asChild>
                <Link href="/guest/login">Magic Link Login</Link>
              </Button>
              <Button asChild>
                <Link href="/privacy-policy">Datenschutz</Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5f7267]">Closed corporate event app</p>
              <h1 className="max-w-3xl text-5xl leading-tight tracking-tight text-[#173325] md:text-6xl">
                Premium Event Guidance for invited conference guests and organizers.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[#4c6256]">
                Registration, agenda, logistics, speaker information, announcements and live check-in in one calm, secure experience designed for private E.ON conference operations.
              </p>
              <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/guest/login">Teilnehmerbereich oeffnen</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                  <Link href="/admin/login">Organizer Sign-in</Link>
              </Button>
            </div>
            </div>
            <Card className="space-y-5 bg-[#163224] p-6 text-[#fbf7ef]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c9d6cf]">Aktueller Event</p>
                <h2 className="mt-3 text-3xl">{event?.name ?? "E.ON Vertriebskonferenz 2026"}</h2>
              </div>
              <div className="space-y-3 text-sm leading-7 text-[#dce5df]">
                <p>{event ? `${formatDate(event.startDate)} bis ${formatDate(event.endDate)}` : "14.-15. Mai 2026"}</p>
                <p>{event ? `${event.locationName}, ${event.locationCity}` : "Messe Dortmund, Kongresszentrum"}</p>
                <p>Einladung, Registrierung, Session-Organisation und Live-Kommunikation fuer geschlossene B2B-Veranstaltungen.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { icon: ClipboardCheck, label: "Registration flow", text: "Secure invitation-based onboarding" },
                  { icon: CalendarRange, label: "Agenda guidance", text: "Current and upcoming sessions at a glance" },
                  { icon: MapPinned, label: "Logistics hub", text: "Hotel, parking, shuttle and FAQ in one place" },
                  { icon: ShieldCheck, label: "Enterprise ready", text: "Role protection, consent storage, audit trail" },
                ].map((item) => (
                  <div key={item.label} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                    <item.icon className="mb-3 size-5 text-[#f5c9bb]" />
                    <p className="font-semibold">{item.label}</p>
                    <p className="mt-1 text-sm text-[#cdd8d1]">{item.text}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
