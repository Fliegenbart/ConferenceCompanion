import { Card } from "@/components/ui/card";

const sections = [
  {
    title: "Verantwortliche Stelle",
    body: "Für die Verarbeitung Ihrer Daten ist die veranstaltende Organisation verantwortlich.",
  },
  {
    title: "Verarbeitete Datenkategorien",
    body: "Gespeichert werden Ihre Kontaktdaten, Ihre Antworten zur Teilnahme und notwendige Angaben für Planung, Anreise und Einlass.",
  },
  {
    title: "Zwecke und Rechtsgrundlagen",
    body: "Die Daten werden nur für Einladung, Durchführung und Nachbereitung der Veranstaltung genutzt.",
  },
  {
    title: "Speicher- und Löschfristen",
    body: "Daten werden nur so lange gespeichert, wie sie für Planung, Nachweise oder den sicheren Betrieb der Veranstaltung nötig sind.",
  },
  {
    title: "Empfänger und technische Dienstleister",
    body: "Ihre Daten werden nur von freigegebenen Dienstleistern verarbeitet, die für Hosting, Versand oder Betrieb der Veranstaltung nötig sind.",
  },
  {
    title: "Betroffenenrechte und Rückfragen",
    body: "Sie können Auskunft, Berichtigung oder Löschung Ihrer Daten anfragen. Die zuständigen Kontakte stehen in Einladung oder Veranstaltungsunterlagen.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen px-4 py-10">
      <Card className="mx-auto max-w-5xl space-y-6 p-8">
        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6b7279]">Datenschutz</p>
          <h1 className="font-manrope text-4xl text-[#111315]">Datenschutz</h1>
          <p className="max-w-3xl text-base leading-7 text-[#5d646b]">
            So nutzen wir Ihre Daten für Einladung, Durchführung und Einlass.
          </p>
        </div>
        <div className="space-y-5">
          {sections.map((section) => (
            <section key={section.title} className="rounded-[20px] border border-[#e2dbd0] bg-[#fbf8f3] p-5">
              <h2 className="font-manrope text-2xl text-[#111315]">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#5d646b]">{section.body}</p>
            </section>
          ))}
        </div>
      </Card>
    </div>
  );
}
