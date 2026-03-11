# E.ON Conference Companion

Private invitation-only conference companion for a closed corporate event such as the fictional `E.ON Vertriebskonferenz 2026`. The app is built for invited guests and organizers, not for public discovery, ticketing, or consumer marketplace use.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- Auth.js / NextAuth
- Microsoft Entra ID for organizer access
- Magic-link access for attendees
- Zod + React Hook Form
- TanStack Table
- Resend transactional mail integration
- PWA manifest + service worker
- QR-based check-in

## What Is Implemented

- Invitation-based attendee registration with secure token links
- Attendee magic-link access for invited guests
- Organizer sign-in page for Microsoft Entra ID
- Tenant-aware and membership-aware admin access checks
- Mobile-first attendee area:
  - Home
  - Agenda
  - My Agenda
  - Event Info
  - Speakers
  - Downloads
  - Updates
  - Feedback
- Organizer dashboard:
  - Overview metrics
  - Attendee management
  - Agenda management
  - Content management
  - Messaging
  - Settings
  - Audit log
- QR check-in flow with browser camera scanning and manual fallback
- Transactional email templates for invitation, confirmation, update, reminder, announcement, and attendee magic-link access
- Prisma schema, migration SQL, and seed data for `E.ON Vertriebskonferenz 2026`
- Pilot governance docs, legal/privacy pilot copy, health endpoint, and observability hooks
- Sample downloadable PDFs under [`public/docs`](/Users/davidwegener/Desktop/neue-apps/ConferenceCompanion/public/docs)

## Enterprise Pilot Hardening

- Organizer access is split from attendee access:
  - Attendees use invitation + magic links
  - Organizers use Microsoft Entra ID
- Admin authorization still depends on database-backed memberships and roles
- Optional tenant and group restrictions can be enforced with environment variables
- Structured auth and mail failures can be routed to `PILOT_ALERT_WEBHOOK_URL`
- Healthcheck endpoint for uptime monitoring: [`/api/health`](/Users/davidwegener/Desktop/neue-apps/ConferenceCompanion/src/app/api/health/route.ts)

Supporting docs:

- [`docs/admin-access-governance.md`](/Users/davidwegener/Desktop/neue-apps/ConferenceCompanion/docs/admin-access-governance.md)
- [`docs/enterprise-pilot-runbook.md`](/Users/davidwegener/Desktop/neue-apps/ConferenceCompanion/docs/enterprise-pilot-runbook.md)

## Placeholder Or v1-Limited Areas

- Legal/privacy copy is now pilot-grade, but still requires final internal legal approval before broad production rollout
- Waitlist is schema-ready but not exposed as a full workflow
- Admin content editing is structured-form based, not a rich CMS
- Push notifications, badge printing, networking, multilingual UX, native wrapper, and live polling/Q&A remain TODOs

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

4. Generate Prisma client and apply schema:

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

## Required Environment Variables

Core runtime:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `APP_SECRET`

Transactional email:

- `EMAIL_FROM`
- `RESEND_API_KEY`

Organizer SSO:

- `ENTRA_ID_CLIENT_ID`
- `ENTRA_ID_CLIENT_SECRET`
- `ENTRA_ID_TENANT_ID`
- `ENTRA_ALLOWED_TENANT_ID`
- `ENTRA_ALLOWED_GROUP_IDS`

Pilot observability:

- `PILOT_ALERT_WEBHOOK_URL`

## Seeded Access

- Example super admin email: `laura.admin@eon.example`
- Example check-in staff email: `max.checkin@eon.example`
- Attendee logins are invitation-based and then magic-link based
- Organizer sign-in requires Microsoft Entra ID configuration plus matching memberships in the app database

Without `RESEND_API_KEY`, email sending is simulated and logged to the server console plus `EmailLog`.

## Database Notes

- Prisma schema: [`prisma/schema.prisma`](/Users/davidwegener/Desktop/neue-apps/ConferenceCompanion/prisma/schema.prisma)
- Seed script: [`prisma/seed.ts`](/Users/davidwegener/Desktop/neue-apps/ConferenceCompanion/prisma/seed.ts)
- Initial SQL migration: [`prisma/migrations/20260311170000_init/migration.sql`](/Users/davidwegener/Desktop/neue-apps/ConferenceCompanion/prisma/migrations/20260311170000_init/migration.sql)
- Enterprise pilot migration: [`prisma/migrations/20260311193000_enterprise_pilot_hardening/migration.sql`](/Users/davidwegener/Desktop/neue-apps/ConferenceCompanion/prisma/migrations/20260311193000_enterprise_pilot_hardening/migration.sql)

## Deployment Notes

Recommended pilot deployment:

- App hosting: Vercel
- Database: managed PostgreSQL
- Email: Resend
- Identity: Microsoft Entra ID
- Health monitoring: uptime probe against `/api/health`

Pilot deployment checklist:

1. Configure runtime secrets and Entra credentials.
2. Run Prisma migrations against the production database.
3. Validate Resend sender domain and email-from policy.
4. Confirm named admin users, roles, and optional Entra groups.
5. Verify `/admin/login`, `/guest/login`, one invitation flow, one announcement, and `/check-in`.
6. Configure `PILOT_ALERT_WEBHOOK_URL` if central pilot alerting is required.

## Governance And Retention Notes

Pilot default retention targets:

- Registrations and attendee operations data: 180 days after event end
- Check-in events and operational logs: 90 days after event end
- Consent records: 3 years pending legal confirmation
- Email logs: 180 days pending legal confirmation

These defaults should be formally aligned with E.ON legal, privacy, and records-management stakeholders before wider rollout.
