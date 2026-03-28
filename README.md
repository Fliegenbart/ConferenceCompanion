# ConferenceCompanion

ConferenceCompanion ist eine private, einladungsbasierte Event-Webapp für geschlossene Firmenveranstaltungen. Sie ist als neutrales Whitelabel-Produkt von Tyrn.ON gedacht und konzentriert sich auf Registrierung, Agenda, Logistik, Teilnehmerkommunikation und Arbeitsabläufe für Organisatoren.

## Technologie

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- Auth.js / NextAuth Magic-Links
- Zod + React Hook Form
- TanStack Table
- Resend für transaktionsbezogene E-Mails
- PWA-Manifest + Service Worker
- QR-Einlass

## Enthalten

- Einladungsgestützte Teilnehmerregistrierung mit sicheren Token-Links
- Gemeinsamer Anmeldelink für Teilnehmer und Organisatoren
- Mobiler Teilnehmerbereich:
  - Startseite
  - Agenda
  - Meine Agenda
  - Veranstaltungsinformationen
  - Referenten
  - Unterlagen
  - Mitteilungen
  - Rückmeldung
- Einfache Verwaltungsoberfläche:
  - Übersicht
  - Teilnehmer
  - Agenda
  - Inhalte
  - Mitteilungen
  - Einstellungen
  - Audit-Protokoll
- QR-Einlass mit Kamera-Scan und manueller Suche
- Transaktions-E-Mails für Einladung, Bestätigung, Mitteilung, Erinnerung, Ankündigung und Anmeldelink-Zugang
- Seed-Daten für ein neutrales Beispiel-Event: `Vertriebskonferenz 2026`

## Lokale Einrichtung

1. Abhängigkeiten installieren:

```bash
pnpm install
```

2. Umgebungsvariablen kopieren:

```bash
cp .env.example .env
```

3. PostgreSQL starten und `DATABASE_URL` bei Bedarf anpassen.

4. Prisma-Client erzeugen und das Schema abgleichen:

```bash
pnpm db:generate
pnpm db:push
```

5. Das Beispiel-Event einspielen:

```bash
pnpm db:seed
```

6. Die App starten:

```bash
pnpm dev
```

7. Im Browser öffnen: [http://localhost:3000](http://localhost:3000)

8. Die Browser-E2E-Suite ausführen, wenn du einen vollständigen Login-, Registrierungs- und Einlass-Test willst:

```bash
pnpm test:e2e
```

Die Suite nutzt Playwright, spielt die Datenbank automatisch neu ein und speichert Artefakte in `output/playwright/`.

## Benötigte Umgebungsvariablen

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `APP_SECRET`
- `EMAIL_FROM`
- `RESEND_API_KEY`

Ohne `RESEND_API_KEY` wird der E-Mail-Versand simuliert und im Serverprotokoll sowie im `EmailLog` erfasst.

Für Playwright-E2E-Läufe muss die lokale `.env`-Datei vorhanden sein, damit der Testprozess `DATABASE_URL`, `NEXTAUTH_SECRET` und `APP_SECRET` laden kann.

## Beispiel-Zugänge

- Beispiel für eine Hauptadministrator-Adresse: `laura.admin@conferencecompanion.example`
- Beispiel für eine Einlass-Adresse: `max.checkin@conferencecompanion.example`
- Teilnehmer nutzen Einladungslinks für die erste Registrierung und Anmeldelinks für den späteren Zugriff
- Organisatoren nutzen denselben Anmeldelink und werden über Rollen in der Datenbank freigeschaltet

## Wichtige Routen

- `/login` gemeinsamer Anmeldelink für Teilnehmer und Organisatoren
- `/invite/[token]` Einladungs- und Registrierungsfluss
- `/guest` Teilnehmerbereich
- `/admin` Verwaltungsbereich
- `/check-in` QR- und manueller Einlass
- `/api/health` leichter Gesundheitscheck für App und Datenbank

## Whitelabel-Hinweise

- Der sichtbare Produktname ist `ConferenceCompanion`
- `powered by Tyrn.ON` wird nur dezent als Produzentenhinweis verwendet
- Die Beispieldaten sind neutral und können pro Kunde ersetzt werden
- Rechtstexte und Datenschutzhinweise sollten vor dem produktiven Einsatz geprüft und angepasst werden

## Spätere Enterprise-Optionen

ConferenceCompanion ist bewusst für einen einfachen Webapp-First-Start konfiguriert. Wenn später stärkere Enterprise-Funktionen nötig sind, sind typische nächste Schritte:

- SSO über einen unternehmensweiten Identitätsanbieter
- kundenspezifische Rechtstexte und Datenschutzhinweise
- Beobachtbarkeit und Alarmierung
- Aufbewahrungsrichtlinien und automatische Bereinigungsjobs
- kundenspezifisches Branding und Absender-Domänen

## Referenz

- Prisma-Schema: [prisma/schema.prisma](/Users/davidwegener/Desktop/neue-apps/ConferenceCompanion/prisma/schema.prisma)
- Seed-Skript: [prisma/seed.ts](/Users/davidwegener/Desktop/neue-apps/ConferenceCompanion/prisma/seed.ts)
- Whitelabel-Hinweise: [docs/whitelabel-setup.md](/Users/davidwegener/Desktop/neue-apps/ConferenceCompanion/docs/whitelabel-setup.md)
