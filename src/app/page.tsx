import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarRange, ClipboardCheck, Download, MapPinned, ShieldCheck, Sparkles } from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getServerAuthSession } from "@/lib/auth";
import { getCurrentEvent } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getServerAuthSession();

  if (session?.user?.roles?.length) {
    redirect("/admin");
  }

  if (session?.user?.attendeeId) {
    redirect("/guest");
  }

  const event = await getCurrentEvent();

  const eventDates = event ? `${formatDate(event.startDate)} bis ${formatDate(event.endDate)}` : "14.-15. Mai 2026";
  const eventLocation = event ? `${event.locationName}, ${event.locationCity}` : "Messe Dortmund, Kongresszentrum";
  const eventDayCount = event
    ? Math.max(Math.round((event.endDate.getTime() - event.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1, 1)
    : 2;

  return (
    <div className="min-h-screen px-4 py-6 md:px-6">
      <main className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <BrandMark />
          <div className="flex flex-wrap gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Jetzt anmelden</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/privacy-policy">Datenschutz</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <Card className="relative overflow-hidden border-[#1b1d20] bg-[#17191c] p-0 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08)_0%,transparent_32%),linear-gradient(180deg,#1a1c20_0%,#111315_100%)]" />
            <div className="relative space-y-10 p-7 md:p-10">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d8d2ca]">
                  <Sparkles className="size-3.5" />
                  Nur für geladene Gäste
                </span>
                <p className="text-sm text-[#d8d2ca]">von Tyrn.ON</p>
              </div>
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(280px,0.98fr)] lg:items-end">
                <div className="min-w-0 space-y-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d8d2ca]">Ihr Zugang</p>
                  <h1 className="max-w-[10ch] text-5xl leading-[0.92] tracking-[-0.08em] md:text-[5.5rem]">
                    Einladung, Agenda, Einlass.
                  </h1>
                  <p className="max-w-lg text-base leading-7 text-[#c9c4bd] md:text-lg">
                    Teilnahme bestätigen, Agenda prüfen und alle Hinweise zum Termin öffnen.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button size="lg" asChild>
                      <Link href="/login">Jetzt anmelden</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link href="/legal">Rechtliches</Link>
                    </Button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      { label: "Termin", value: `${eventDayCount} Tage` },
                      { label: "Anmeldung", value: "Nur mit Einladung" },
                      { label: "Nutzung", value: "Am Handy und Desktop" },
                    ].map((item) => (
                      <div key={item.label} className="rounded-[18px] border border-white/10 bg-white/5 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d8d2ca]">{item.label}</p>
                        <p className="mt-2 text-sm font-medium text-white">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <Card className="min-w-0 space-y-5 border-white/10 bg-white/5 p-6 text-white shadow-none">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d8d2ca]">Nächster Termin</p>
                    <h2 className="mt-3 max-w-[11ch] font-manrope text-4xl leading-[0.96] tracking-[-0.06em]">
                      {event?.name ?? "Vertriebskonferenz 2026"}
                    </h2>
                  </div>
                  <div className="space-y-2 text-sm leading-7 text-[#c9c4bd]">
                    <p>{eventDates}</p>
                    <p>{eventLocation}</p>
                    <p>Teilnahme nur mit persönlicher Einladung.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d8d2ca]">
                      Registrieren
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d8d2ca]">
                      Planen
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d8d2ca]">
                      Einlassen
                    </span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      { icon: ClipboardCheck, label: "Anmeldung", text: "Teilnahme bestätigen" },
                      { icon: CalendarRange, label: "Agenda", text: "Zeiten und Räume sehen" },
                      { icon: MapPinned, label: "Anreise", text: "Ort, Hotel und Shuttle" },
                      { icon: ShieldCheck, label: "Zugang", text: "Persönlicher Zugang" },
                    ].map((item) => (
                      <div key={item.label} className="rounded-[18px] border border-white/10 bg-white/5 p-4">
                        <item.icon className="mb-3 size-5 text-[#dce6e1]" />
                        <p className="font-semibold">{item.label}</p>
                        <p className="mt-1 text-sm text-[#c9c4bd]">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </Card>

          <Card className="space-y-6 p-6 md:p-7">
            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6a6256]">Was Sie erledigen</p>
              <h2 className="max-w-[10ch] font-manrope text-4xl font-semibold leading-[0.96] tracking-[-0.06em] text-[#111315]">
                Alles Wichtige sofort.
              </h2>
              <p className="max-w-lg text-sm leading-6 text-[#59616a]">
                Anmeldung, Agenda, Unterlagen und Einlass liegen an einem Ort.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: ClipboardCheck, label: "Antwort", text: "Zu- oder absagen" },
                { icon: CalendarRange, label: "Programm", text: "Zeiten und Räume prüfen" },
                { icon: Download, label: "Unterlagen", text: "Pläne und PDFs öffnen" },
                { icon: ShieldCheck, label: "Bereich", text: "Eigene Inhalte sehen" },
              ].map((item) => (
                <div key={item.label} className="rounded-[18px] border border-[#d5ccbf] bg-[#f7f3ed] p-4">
                  <item.icon className="mb-3 size-5 text-[#255447]" />
                  <p className="font-medium text-[#111315]">{item.label}</p>
                  <p className="mt-1 text-sm leading-6 text-[#59616a]">{item.text}</p>
                </div>
              ))}
            </div>
            <div className="rounded-[18px] border border-[#d5ccbf] bg-[#f7f3ed] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6a6256]">In 2 Schritten</p>
              <p className="mt-2 text-sm leading-6 text-[#59616a]">
                E-Mail eingeben, Link öffnen, Bereich nutzen.
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
