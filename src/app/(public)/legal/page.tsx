import { Card } from "@/components/ui/card";

const sections = [
  {
    title: "Verwendungsrahmen",
    body: "Der E.ON Conference Companion ist eine interne bzw. geschlossene Eventanwendung fuer eingeladenen Teilnehmerkreis, Organisatoren und freigegebene Service-Rollen. Es handelt sich nicht um einen oeffentlichen Marktplatz und nicht um ein Ticketverkaufssystem.",
  },
  {
    title: "Nutzungs- und Zugriffsregeln",
    body: "Zugang erhalten nur eingeladenene Teilnehmer ueber persoenliche Einladungs- oder Magic-Link-Flows sowie freigegebene Admin-Nutzer ueber Microsoft Entra ID. Eine Weitergabe von Zugangslinks, QR-Codes oder Admin-Zugaengen ist unzulaessig. Alle administrativen Aenderungen sind im Rahmen des Pilotbetriebs nachvollziehbar zu protokollieren.",
  },
  {
    title: "Pilotbetrieb und Freigabestatus",
    body: "Die Anwendung befindet sich in einem kontrollierten Pilot-Rollout fuer Unternehmensveranstaltungen. Inhalte, Prozesse und Schnittstellen sind fuer diesen Zweck freigegeben, koennen jedoch vor einer konzernweiten Nutzung weiteren fachlichen, datenschutzrechtlichen und sicherheitsbezogenen Freigaben unterliegen.",
  },
  {
    title: "Betriebs- und Sicherheitsvorbehalte",
    body: "Im Pilotbetrieb duerfen nur freigegebene Hosting-, Datenbank-, Mail- und Monitoring-Konfigurationen genutzt werden. Jede Aenderung an Rollen, Consent-Texten, Messaging, Exporten, Check-in-Overrides oder produktionsnahen Einstellungen ist durch das Pilotteam nach dem Vier-Augen-Prinzip zu pruefen.",
  },
  {
    title: "Kontakt fuer Governance und Betrieb",
    body: "Fragen zu Betrieb, Zugriffen, Freigaben, Datenschutz oder Incident-Handling sind an die benannten Event-, IT- und Datenschutzverantwortlichen des Pilotteams zu richten. Vor produktivem Einsatz muessen Ansprechpartner, Eskalationswege und Notfallprozesse schriftlich dokumentiert sein.",
  },
];

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#dfe8da_0%,#eef2ec_45%,#f6f4ee_100%)] px-4 py-10">
      <Card className="mx-auto max-w-5xl space-y-6 p-8">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6b7f73]">Pilot Governance</p>
          <h1 className="text-4xl text-[#173325]">Rechtliche Hinweise</h1>
          <p className="text-base leading-7 text-[#5d7065]">
            Diese Hinweise definieren den rechtlichen und organisatorischen Rahmen fuer den minimalen Enterprise-Pilot des E.ON Conference Companion. Sie ersetzen keine verbindliche juristische Freigabe, dienen aber als belastbare Pilotgrundlage fuer interne Tests und kontrollierte Eventeinsaetze.
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
