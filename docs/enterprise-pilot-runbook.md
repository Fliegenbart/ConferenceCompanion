# Enterprise Pilot Runbook

## Deployment Baseline

- Hosting: Vercel
- Database: PostgreSQL
- Identity: Microsoft Entra ID for organizers
- Transactional email: Resend
- Health endpoint: `/api/health`

## Pre-Deployment Checklist

1. Set `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `APP_SECRET`, and `RESEND_API_KEY`.
2. Configure `ENTRA_ID_CLIENT_ID`, `ENTRA_ID_CLIENT_SECRET`, and `ENTRA_ID_TENANT_ID`.
3. Set `ENTRA_ALLOWED_TENANT_ID` and `ENTRA_ALLOWED_GROUP_IDS` if access should be restricted beyond database memberships.
4. Run Prisma migrations against the target database.
5. Validate sender domain and email-from policy in Resend.
6. Confirm named admin users and their roles.

## Smoke Test Before Pilot

1. Open `/api/health` and confirm database connectivity.
2. Verify organizer sign-in through `/admin/login`.
3. Verify an invited attendee can request a magic link through `/guest/login`.
4. Complete one registration from an invitation link.
5. Send one test announcement from the admin dashboard.
6. Verify check-in works through QR or manual search on staging.

## Pilot-Day Monitoring

- Watch application logs for `auth.admin.denied`, `auth.logger.error`, and `email.send.failed`.
- Monitor `/api/health` with an uptime check.
- Review messaging sends and check-in overrides in the audit log.
- Route severe alerts to `PILOT_ALERT_WEBHOOK_URL` if configured.

## Proposed Retention Baseline

- Registrations and attendee operations data: 180 days after event end
- Check-in events and operational logs: 90 days after event end
- Consent records: 3 years pending legal confirmation
- Email logs: 180 days pending legal confirmation

## Rollback Paths

### Auth Misconfiguration

1. Remove Entra-specific variables from the deployment.
2. Re-deploy to disable the admin SSO provider.
3. Restore database memberships before retesting.
4. Re-apply Entra configuration once tenant/app settings are corrected.

### Failed Deployment

1. Roll back to the previous Vercel deployment.
2. Validate `/api/health`.
3. Confirm admin login and attendee login.
4. Review migration state before reattempting deployment.

## Post-Pilot Review

- Review audit log entries for privileged actions
- Review admin access list and offboarding needs
- Confirm deletion timeline for pilot data
- Document gaps before widening rollout
