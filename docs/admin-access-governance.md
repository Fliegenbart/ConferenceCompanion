# Admin Access Governance

## Purpose

This document defines the minimum access governance model for the first internal pilot of the E.ON Conference Companion.

## Access Principles

- Organizer access uses Microsoft Entra ID only.
- Attendee access remains invitation-based and magic-link based.
- Admin access is granted only to named users with a documented business need.
- Permissions must be assigned with least privilege.
- Every admin user must have an owner responsible for review and offboarding.

## Named Access Process

1. Request access with name, email, event, business purpose, and requested role.
2. Confirm the user belongs to the approved Entra tenant.
3. Confirm the user is part of the required Entra group if group filtering is enabled.
4. Create or confirm the matching `User` and `Membership` records in the application database.
5. Verify access on staging before production access is used.

## Role Assignment Guidance

- `SUPER_ADMIN`: platform owner for pilot, limited to a minimal trusted group
- `EVENT_ADMIN`: operational owner for event configuration and attendee management
- `CONTENT_EDITOR`: content and announcement management only
- `CHECKIN_STAFF`: on-site check-in access only
- `READ_ONLY`: observation and support without mutation rights

## Review Requirements During Pilot

The following actions should be reviewed after each pilot event:

- New admin assignments and removals
- Invitation resends to VIP or escalated attendees
- Registration overrides and session-capacity exceptions
- Broadcast messages to attendee groups
- Manual check-in overrides
- Changes to consent text, legal URLs, and event settings

## Offboarding

1. Remove the Entra group assignment if used.
2. Remove or downgrade the app membership.
3. Confirm no active operational need remains.
4. Capture the change in the operational access log.

## Notes

- This document is a pilot governance baseline and should be aligned with formal E.ON IAM and joiner/mover/leaver processes before wider rollout.
