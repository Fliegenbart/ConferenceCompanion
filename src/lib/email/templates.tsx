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
          <Text style={eyebrowStyle}>ConferenceCompanion</Text>
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
          <Text style={footerStyle}>Nachricht zu Ihrer Veranstaltung.</Text>
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
      intro={`Guten Tag ${props.attendeeName}, öffnen Sie den Link und bestätigen Sie Ihre Teilnahme.`}
      ctaHref={props.ctaHref}
      ctaLabel="Registrierung öffnen"
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
      preview={`Bestätigung für ${props.eventName}`}
      heading="Registrierung gespeichert"
      intro={`Vielen Dank ${props.attendeeName}. Ihre Anmeldung ist gespeichert.`}
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
      heading="Ihre Angaben wurden aktualisiert"
      intro={`Hallo ${props.attendeeName}, Ihre Angaben zu ${props.eventName} wurden aktualisiert.`}
      ctaHref={props.ctaHref}
      ctaLabel="Angaben ansehen"
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
      heading="Kurze Erinnerung"
      intro={`Hallo ${props.attendeeName}, Ihr Termin für ${props.eventName} rückt näher.`}
      ctaHref={props.ctaHref}
      ctaLabel="Zur Veranstaltung"
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
      ctaLabel="Nachricht öffnen"
    />
  );
}

export function MagicLinkEmailTemplate(props: {
  url: string;
}) {
  return (
    <BaseEmailTemplate
      preview="Ihr Link zur Anmeldung"
      heading="Anmelden"
      intro="Öffnen Sie den Link und gehen Sie direkt in Ihren Bereich."
      ctaHref={props.url}
      ctaLabel="Jetzt anmelden"
    >
      <Text style={footerStyle}>Der Link ist zeitlich begrenzt und nur für Sie bestimmt.</Text>
    </BaseEmailTemplate>
  );
}

const bodyStyle = {
  backgroundColor: "#faf9f8",
  fontFamily: "Helvetica, Arial, sans-serif",
  margin: "0 auto",
  padding: "32px 12px",
};

const containerStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid rgba(221, 214, 203, 0.9)",
  borderRadius: "20px",
  margin: "0 auto",
  maxWidth: "620px",
  padding: "40px",
};

const eyebrowStyle = {
  color: "#6b7279",
  fontSize: "13px",
  fontWeight: 700,
  letterSpacing: "0.14em",
  margin: "0 0 12px",
  textTransform: "uppercase" as const,
};

const headingStyle = {
  color: "#111315",
  fontSize: "30px",
  fontWeight: 700,
  lineHeight: "1.2",
  margin: "0 0 16px",
};

const introStyle = {
  color: "#5d646b",
  fontSize: "16px",
  lineHeight: "1.7",
  margin: "0 0 20px",
};

const buttonStyle = {
  backgroundColor: "#111315",
  borderRadius: "14px",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: 700,
  padding: "14px 24px",
  textDecoration: "none",
};

const dividerStyle = {
  borderColor: "#ddd6cb",
  margin: "28px 0 20px",
};

const detailStyle = {
  color: "#5d646b",
  fontSize: "14px",
  lineHeight: "1.65",
  margin: "0 0 8px",
};

const footerStyle = {
  color: "#717976",
  fontSize: "13px",
  lineHeight: "1.5",
  margin: "0",
};
