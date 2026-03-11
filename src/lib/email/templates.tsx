import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";

type BaseTemplateProps = {
  preview: string;
  heading: string;
  intro: string;
  ctaLabel?: string;
  ctaHref?: string;
  children?: ReactNode;
};

function BaseEmailTemplate({ preview, heading, intro, ctaLabel, ctaHref, children }: BaseTemplateProps) {
  return (
    <Html lang="de">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Text style={eyebrowStyle}>E.ON Conference Companion</Text>
          <Heading style={headingStyle}>{heading}</Heading>
          <Text style={introStyle}>{intro}</Text>
          {children}
          {ctaHref && ctaLabel ? (
            <Section style={{ marginTop: "28px", marginBottom: "24px" }}>
              <Button href={ctaHref} style={buttonStyle}>
                {ctaLabel}
              </Button>
            </Section>
          ) : null}
          <Hr style={dividerStyle} />
          <Text style={footerStyle}>
            Diese Nachricht wurde fuer eine geschlossene Veranstaltungsorganisation versendet.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export function InvitationEmailTemplate(props: {
  attendeeName: string;
  eventName: string;
  eventDate: string;
  ctaHref: string;
}) {
  return (
    <BaseEmailTemplate
      preview={`Einladung zur ${props.eventName}`}
      heading={`Einladung zur ${props.eventName}`}
      intro={`Guten Tag ${props.attendeeName}, Sie sind herzlich eingeladen. Bitte bestaetigen Sie Ihre Teilnahme ueber den folgenden Link.`}
      ctaHref={props.ctaHref}
      ctaLabel="Registrierung oeffnen"
    >
      <Text style={detailStyle}>Veranstaltung: {props.eventName}</Text>
      <Text style={detailStyle}>Termin: {props.eventDate}</Text>
    </BaseEmailTemplate>
  );
}

export function RegistrationConfirmationEmailTemplate(props: {
  attendeeName: string;
  eventName: string;
  summary: string[];
  ctaHref: string;
}) {
  return (
    <BaseEmailTemplate
      preview={`Bestaetigung fuer ${props.eventName}`}
      heading="Ihre Registrierung wurde gespeichert"
      intro={`Vielen Dank ${props.attendeeName}. Ihre Angaben fuer den Event Companion wurden erfolgreich uebernommen.`}
      ctaHref={props.ctaHref}
      ctaLabel="Zum Teilnehmerbereich"
    >
      {props.summary.map((line) => (
        <Text key={line} style={detailStyle}>
          {line}
        </Text>
      ))}
    </BaseEmailTemplate>
  );
}

export function RegistrationUpdateEmailTemplate(props: {
  attendeeName: string;
  eventName: string;
  ctaHref: string;
}) {
  return (
    <BaseEmailTemplate
      preview={`Aktualisierung Ihrer Angaben`}
      heading="Ihre Registrierung wurde aktualisiert"
      intro={`Hallo ${props.attendeeName}, Ihre Angaben zur ${props.eventName} wurden aktualisiert.`}
      ctaHref={props.ctaHref}
      ctaLabel="Details ansehen"
    />
  );
}

export function ReminderEmailTemplate(props: {
  attendeeName: string;
  eventName: string;
  ctaHref: string;
}) {
  return (
    <BaseEmailTemplate
      preview={`Erinnerung an ${props.eventName}`}
      heading="Erinnerung zur Veranstaltung"
      intro={`Hallo ${props.attendeeName}, hier ist eine kurze Erinnerung an Ihre bevorstehende Teilnahme an ${props.eventName}.`}
      ctaHref={props.ctaHref}
      ctaLabel="Event Companion oeffnen"
    />
  );
}

export function AnnouncementEmailTemplate(props: {
  title: string;
  body: string;
  ctaHref: string;
}) {
  return (
    <BaseEmailTemplate
      preview={props.title}
      heading={props.title}
      intro={props.body}
      ctaHref={props.ctaHref}
      ctaLabel="Update im Companion ansehen"
    />
  );
}

export function MagicLinkEmailTemplate(props: {
  url: string;
}) {
  return (
    <BaseEmailTemplate
      preview="Ihr sicherer Zugang zum Conference Companion"
      heading="Sicherer Zugang"
      intro="Bitte verwenden Sie den folgenden Button, um sich in Ihren persoenlichen Bereich einzuloggen."
      ctaHref={props.url}
      ctaLabel="Jetzt anmelden"
    >
      <Text style={footerStyle}>Der Link ist zeitlich begrenzt und nur fuer Sie bestimmt.</Text>
    </BaseEmailTemplate>
  );
}

const bodyStyle = {
  backgroundColor: "#eef2ec",
  fontFamily: "Helvetica, Arial, sans-serif",
  margin: "0 auto",
  padding: "32px 12px",
};

const containerStyle = {
  backgroundColor: "#fbf7ef",
  border: "1px solid #d8dfd5",
  borderRadius: "24px",
  margin: "0 auto",
  maxWidth: "620px",
  padding: "40px",
};

const eyebrowStyle = {
  color: "#33674a",
  fontSize: "13px",
  fontWeight: 700,
  letterSpacing: "0.14em",
  margin: "0 0 12px",
  textTransform: "uppercase" as const,
};

const headingStyle = {
  color: "#12261c",
  fontSize: "30px",
  fontWeight: 700,
  lineHeight: "1.2",
  margin: "0 0 16px",
};

const introStyle = {
  color: "#31453b",
  fontSize: "16px",
  lineHeight: "1.7",
  margin: "0 0 20px",
};

const buttonStyle = {
  backgroundColor: "#da4f29",
  borderRadius: "999px",
  color: "#fff8f1",
  fontSize: "15px",
  fontWeight: 700,
  padding: "14px 24px",
  textDecoration: "none",
};

const dividerStyle = {
  borderColor: "#d8dfd5",
  margin: "28px 0 20px",
};

const detailStyle = {
  color: "#31453b",
  fontSize: "14px",
  lineHeight: "1.65",
  margin: "0 0 8px",
};

const footerStyle = {
  color: "#5b6d63",
  fontSize: "13px",
  lineHeight: "1.5",
  margin: "0",
};
