# E.ON Conference Companion

Private invitation-only conference companion for a closed corporate event such as the fictional `E.ON Vertriebskonferenz 2026`. The app is built for invited guests and organizers, not for public discovery, ticketing, or consumer marketplace use.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- Auth.js / NextAuth email magic links
- Zod + React Hook Form
- TanStack Table
- Resend transactional mail integration
- PWA manifest + service worker
- QR-based check-in

## What Is Implemented

- Invitation-based attendee registration with secure token links
- Magic-link access for attendees and admins
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
- Transactional email templates for invitation, confirmation, update, reminder, announcement, and magic-link access
- Prisma schema, generated migration SQL, and seed data for `E.ON Vertriebskonferenz 2026`
- Sample downloadable PDFs under [`public/docs`](/Users/davidwegener/Desktop/neue-apps/ConferenceCompanion/public/docs)

## Placeholder Or v1-Limited Areas

- Legal notice and privacy policy pages contain placeholder copy
- Waitlist is schema-ready but not exposed as a full workflow
- Admin content editing is structured-form based, not a rich CMS
- Corporate SSO / Entra ID is not implemented yet
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

## Seeded Access

- Example super admin email: `laura.admin@eon.example`
- Example check-in staff email: `max.checkin@eon.example`
- Attendee logins are invitation-based and then magic-link based

Without `RESEND_API_KEY`, email sending is simulated and logged to the server console plus `EmailLog`.

## Database Notes

- Prisma schema: [`prisma/schema.prisma`](/Users/davidwegener/Desktop/neue-apps/ConferenceCompanion/prisma/schema.prisma)
- Seed script: [`prisma/seed.ts`](/Users/davidwegener/Desktop/neue-apps/ConferenceCompanion/prisma/seed.ts)
- SQL migration: [`prisma/migrations/20260311170000_init/migration.sql`](/Users/davidwegener/Desktop/neue-apps/ConferenceCompanion/prisma/migrations/20260311170000_init/migration.sql)

## Deployment Notes

Recommended baseline deployment:

- App hosting: Vercel
- Database: managed PostgreSQL
- Email: Resend
- File assets: static files in `public/` or later object storage

Production checklist:

1. Configure `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `APP_SECRET`, `DATABASE_URL`, and `RESEND_API_KEY`.
2. Run Prisma migrations against the production database.
3. Replace placeholder legal text with approved E.ON content.
4. Validate domain/email sender configuration in Resend.
5. Review admin seed strategy and restrict admin emails.
6. Add monitoring, backups, retention policies, and security review before go-live.

## Recommended Next Steps For Enterprise Rollout

1. Replace magic-link admin auth with E.ON Entra ID / SSO integration.
2. Finalize GDPR text, consent wording, retention periods, and audit review.
3. Add observability, alerting, and operational dashboards.
4. Complete UAT with realistic attendee imports and venue operations.
5. Extend check-in for badge printing and offline fallback procedures.
