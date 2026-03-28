import { Card } from "@/components/ui/card";

const sections = [
  {
    title: "Verwendungsrahmen",
    body: "Zugang nur für geladene Teilnehmer und freigegebene Teams. Keine öffentliche Anmeldung und kein offener Verkauf.",
  },
  {
    title: "Nutzungs- und Zugriffsregeln",
    body: "Nutzen Sie nur Ihren eigenen Link oder Zugang. Geben Sie QR-Codes, Einladungslinks oder Admin-Zugänge nicht weiter.",
  },
  {
    title: "Whitelabel-Betrieb",
    body: "Veranstalter können Namen, Inhalte, Rechtstexte und Abläufe für ihre Veranstaltung anpassen.",
  },
  {
    title: "Betriebs- und Sicherheitsvorbehalte",
    body: "Vor dem Livegang sollten Rollen, Texte, Versand und Einlassregeln geprüft und freigegeben werden.",
  },
  {
    title: "Kontakt für Betrieb und Datenschutz",
    body: "Bei Fragen zu Zugriff, Datenschutz oder Betrieb wenden Sie sich an die benannten Event-, IT- oder Datenschutzkontakte.",
  },
];

export default function LegalPage() {
  return (
    <div className="min-h-screen px-4 py-10">
      <Card className="mx-auto max-w-5xl space-y-6 p-8">
        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6b7279]">Rechtliches</p>
          <h1 className="font-manrope text-4xl text-[#111315]">Rechtliche Hinweise</h1>
          <p className="max-w-3xl text-base leading-7 text-[#5d646b]">
            Wichtige Hinweise zu Zugang, Nutzung und Verantwortung.
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
