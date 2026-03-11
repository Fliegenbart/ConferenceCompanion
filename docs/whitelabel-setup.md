# ConferenceCompanion Whitelabel Setup

## Ziel

ConferenceCompanion is built as a reusable webapp for private conferences. The default setup keeps authentication simple, uses neutral sample data, and avoids customer-specific SSO dependencies.

## Recommended First Setup

1. Configure PostgreSQL, `NEXTAUTH_SECRET`, `APP_SECRET`, and `EMAIL_FROM`.
2. Run `pnpm db:generate`, `pnpm db:push`, and `pnpm db:seed`.
3. Open `/login` and test one organizer email from the seed data.
4. Open one invitation link from the seeded attendee records and complete registration.
5. Verify attendee pages, admin pages, and check-in on staging before customizing branding or content.

## Whitelabel Adaptation Checklist

- Replace sample event, venue, and logistics content
- Replace legal and privacy texts with customer-approved wording
- Update sender domain for transactional emails
- Adjust seed/demo users for the client project
- Review whether check-in, feedback, and downloads are needed for the rollout

## Optional Later Enhancements

- SSO for organizers
- customer-specific theming
- multilingual content
- push notifications
- badge printing
