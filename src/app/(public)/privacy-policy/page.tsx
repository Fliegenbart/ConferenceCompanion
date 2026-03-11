import { Card } from "@/components/ui/card";

const sections = [
  {
    title: "Verantwortliche Stelle",
    body: "ConferenceCompanion wird fuer die Organisation geschlossener Unternehmensveranstaltungen eingesetzt. Verantwortlich fuer die Verarbeitung der im Companion gepflegten Teilnehmer- und Organisationsdaten ist jeweils die veranstaltende Organisation gemeinsam mit den benannten Event-, Datenschutz- und IT-Ansprechpartnern.",
  },
  {
    title: "Verarbeitete Datenkategorien",
    body: "Verarbeitet werden insbesondere Stammdaten der eingeladenen Personen, Registrierungsangaben, Reise- und Hotelinformationen, Angaben zu Ernaehrung und Barrierefreiheit, Session-Auswahlen, Kommunikationshistorie, Consent-Nachweise und Check-in-Ereignisse. Zugriff erhalten ausschliesslich freigegebene Rollen fuer Eventsteuerung, Contentpflege und Check-in.",
  },
  {
    title: "Zwecke und Rechtsgrundlagen",
    body: "Die Verarbeitung dient ausschliesslich der Planung, Durchfuehrung, Betreuung und Nachbereitung der geschlossenen Veranstaltung. Dazu gehoeren Einladung, Registrierung, Teilnehmerkommunikation, Venue-Logistik, Sicherheits- und Zutrittsorganisation, Sessionplanung sowie die Dokumentation von erteilten Einwilligungen.",
  },
  {
    title: "Speicher- und Loeschfristen",
    body: "Als Whitelabel-Standard gelten folgende Aufbewahrungsziele: Organisations- und Registrierungsdaten bis 180 Tage nach Veranstaltungsende, Check-in- und operative Logdaten bis 90 Tage nach Veranstaltungsende, Consent-Nachweise bis 3 Jahre fuer Nachweiszwecke. Vor produktivem Einsatz sollte diese Fristenlogik mit Datenschutz und Records Management der veranstaltenden Organisation abgestimmt werden.",
  },
  {
    title: "Empfaenger und technische Dienstleister",
    body: "Die Anwendung wird auf einer freigegebenen Hosting-Plattform betrieben. E-Mail-Kommunikation erfolgt ueber den konfigurierten Transaktionsmail-Dienst, Datenhaltung ueber PostgreSQL. Dienstleister und technische Betreiber duerfen Daten ausschliesslich im Rahmen der Auftragsverarbeitung und der dokumentierten Betriebsprozesse verarbeiten.",
  },
  {
    title: "Betroffenenrechte und Rueckfragen",
    body: "Betroffene Personen koennen Auskunft, Berichtigung, Loeschung oder Einschraenkung der Verarbeitung nach den einschlaegigen internen und gesetzlichen Vorgaben anfragen. Rueckfragen fuer den Pilotbetrieb sind ueber die in der Einladung oder in den Veranstaltungsunterlagen benannten Datenschutz- und Eventkontakte zu adressieren.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#dfe8da_0%,#eef2ec_45%,#f6f4ee_100%)] px-4 py-10">
      <Card className="mx-auto max-w-5xl space-y-6 p-8">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6b7f73]">Privacy</p>
          <h1 className="text-4xl text-[#173325]">Datenschutzinformation</h1>
          <p className="text-base leading-7 text-[#5d7065]">
            Diese Datenschutzinformation beschreibt den vorgesehenen Datenumgang fuer ConferenceCompanion als geschlossene Event-Webapp. Vor jedem produktiven Einsatz sollten die Texte an die veranstaltende Organisation und deren rechtliche Anforderungen angepasst werden.
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
