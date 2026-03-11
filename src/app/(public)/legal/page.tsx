import { Card } from "@/components/ui/card";

const sections = [
  {
    title: "Verwendungsrahmen",
    body: "ConferenceCompanion ist eine geschlossene Eventanwendung fuer eingeladene Teilnehmer, Organizer und freigegebene Service-Rollen. Es handelt sich nicht um einen oeffentlichen Marktplatz und nicht um ein Ticketverkaufssystem.",
  },
  {
    title: "Nutzungs- und Zugriffsregeln",
    body: "Zugang erhalten nur eingeladene Teilnehmer ueber persoenliche Einladungs- oder Magic-Link-Flows sowie freigegebene Admin-Nutzer mit zugeordneter Rolle. Eine Weitergabe von Zugangslinks, QR-Codes oder Admin-Zugaengen ist unzulaessig. Administrative Aenderungen sollen nachvollziehbar protokolliert werden.",
  },
  {
    title: "Whitelabel-Betrieb",
    body: "ConferenceCompanion wird als Whitelabel-Webapp fuer geschlossene Unternehmensveranstaltungen bereitgestellt. Inhalte, Corporate Design, Rechtstexte und Prozesse koennen pro Einsatzfall angepasst werden.",
  },
  {
    title: "Betriebs- und Sicherheitsvorbehalte",
    body: "Fuer produktive Einsaetze sollen nur freigegebene Hosting-, Datenbank- und Mail-Konfigurationen verwendet werden. Aenderungen an Rollen, Consent-Texten, Messaging, Exporten oder Check-in-Overrides sollten vor dem Einsatz geprueft und dokumentiert werden.",
  },
  {
    title: "Kontakt fuer Betrieb und Datenschutz",
    body: "Fragen zu Zugriffen, Freigaben, Datenschutz oder Incident-Handling sind an die jeweils benannten Event-, IT- und Datenschutzkontakte der veranstaltenden Organisation zu richten.",
  },
];

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#dfe8da_0%,#eef2ec_45%,#f6f4ee_100%)] px-4 py-10">
      <Card className="mx-auto max-w-5xl space-y-6 p-8">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6b7f73]">Legal Notice</p>
          <h1 className="text-4xl text-[#173325]">Rechtliche Hinweise</h1>
          <p className="text-base leading-7 text-[#5d7065]">
            Diese Hinweise beschreiben den rechtlichen und organisatorischen Rahmen fuer den Einsatz von ConferenceCompanion als geschlossene Event-Webapp. Sie sollten vor jedem produktiven Einsatz um veranstaltungsspezifische Pflichtangaben ergaenzt werden.
          </p>
        </div>
        <div className="space-y-5">
          {sections.map((section) => (
            <section key={section.title} className="rounded-[24px] border border-[#d9e1d5] bg-[#f8faf6] p-5">
              <h2 className="text-2xl text-[#173325]">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#496054]">{section.body}</p>
            </section>
          ))}
        </div>
      </Card>
    </div>
  );
}
