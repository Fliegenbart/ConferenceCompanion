# ConferenceCompanion

ConferenceCompanion is a private, invitation-only event webapp for closed corporate conferences. It is designed as a neutral whitelabel product by Tyrn.ON and focuses on registration, agenda, logistics, participant communication, and organizer workflows.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- Auth.js / NextAuth magic links
- Zod + React Hook Form
- TanStack Table
- Resend transactional mail integration
- PWA manifest + service worker
- QR-based check-in

## What Is Included

- Invitation-based attendee registration with secure token links
- Shared magic-link login for attendees and organizers
- Mobile-first attendee area:
  - Home
  - Agenda
  - Meine Agenda
  - Event-Informationen
  - Speaker
  - Downloads
  - Updates
  - Feedback
- Basic organizer dashboard:
  - Uebersicht
  - Teilnehmer
  - Agenda
  - Inhalte
  - Nachrichten
  - Einstellungen
  - Audit Log
- QR check-in flow with camera scan and manual fallback
- Transactional emails for invitation, confirmation, update, reminder, announcement, and magic-link access
- Seed data for a neutral sample event: `Vertriebskonferenz 2026`

## Local Setup

1. Install dependencies:

```bash
pnpm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Start PostgreSQL and update `DATABASE_URL` if needed.

4. Generate Prisma client and sync the schema:

```bash
pnpm db:generate
pnpm db:push
```

5. Seed the sample conference:

```bash
pnpm db:seed
```

6. Run the app:

```bash
pnpm dev
```

7. Open [http://localhost:3000](http://localhost:3000)

## Required Environment Variables

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `APP_SECRET`
- `EMAIL_FROM`
- `RESEND_API_KEY`

Without `RESEND_API_KEY`, email sending is simulated and logged to the server console plus `EmailLog`.

## Seeded Access

- Example super admin email: `laura.admin@conferencecompanion.example`
- Example check-in staff email: `max.checkin@conferencecompanion.example`
- Attendees use invitation links for first registration and magic links for return access
- Organizers use the same magic-link login and are authorized through memberships in the database

## Important Routes

- `/login` shared login for attendees and organizers
- `/invite/[token]` invitation and registration flow
- `/guest` attendee webapp
- `/admin` organizer dashboard
- `/check-in` QR and manual check-in
- `/api/health` lightweight app/database health endpoint

## Whitelabel Notes

- The visible product name is `ConferenceCompanion`
- `powered by Tyrn.ON` is used only as a subtle producer hint
- Sample data is neutral and can be replaced per client deployment
- Legal and privacy copy should still be reviewed and tailored for each customer rollout

## Future Enterprise Options

ConferenceCompanion is intentionally configured for a simple webapp-first launch. If a client later needs stronger enterprise controls, typical next steps are:

- SSO via a corporate identity provider
- customer-specific legal/privacy wording
- observability and alert routing
- retention policies and automated cleanup jobs
- tenant-specific branding and sender domains

## Reference

- Prisma schema: [prisma/schema.prisma](/Users/davidwegener/Desktop/neue-apps/ConferenceCompanion/prisma/schema.prisma)
- Seed script: [prisma/seed.ts](/Users/davidwegener/Desktop/neue-apps/ConferenceCompanion/prisma/seed.ts)
- Whitelabel setup notes: [docs/whitelabel-setup.md](/Users/davidwegener/Desktop/neue-apps/ConferenceCompanion/docs/whitelabel-setup.md)
