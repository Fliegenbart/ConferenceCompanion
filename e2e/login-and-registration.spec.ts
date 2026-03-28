import { test, expect } from "@playwright/test";

import { PHOTO_CONSENT_LABEL } from "@/lib/constants";
import { signInWithMagicLink } from "./support/auth";
import { createInvitationFixture, waitForAttendeeStatus } from "./support/db";

test.describe("ConferenceCompanion web app flows", () => {
  test("admin and attendee login via shared magic-link flow", async ({ page, request }) => {
    await signInWithMagicLink(page, request, "laura.admin@conferencecompanion.example", "admin");
    await expect(page.getByRole("heading", { name: "Veranstaltungsuebersicht" })).toBeVisible();

    const attendee = await createInvitationFixture(request, {
      firstName: "Mara",
      lastName: "Neumann",
      emailPrefix: "e2e-login",
    });

    await page.goto(`/invite/${attendee.rawToken}`);
    await page.locator('input[type="radio"][value="YES"]').check();
    await page.getByLabel("Telefon").fill("+49 151 5554321");
    await page.getByRole("button", { name: "Registrierung abschliessen" }).click();
    await expect(page).toHaveURL(new RegExp(`/invite/${attendee.rawToken}/confirmation$`));

    await signInWithMagicLink(page, request, attendee.attendee.email, "guest");
    await expect(page.getByRole("heading", { name: `Willkommen, ${attendee.attendee.firstName}` })).toBeVisible();
    await expect(page).toHaveURL(/\/guest$/);
  });

  test("guest registration completes from an invitation link and supports attendee return login", async ({ page, request }) => {
    const invitation = await createInvitationFixture(request, {
      firstName: "Nina",
      lastName: "Becker",
      emailPrefix: "e2e-registration",
    });

    await page.goto(`/invite/${invitation.rawToken}`);
    await expect(page.getByRole("heading", { name: "Registrierung" })).toBeVisible();

    await page.locator('input[type="radio"][name="attendanceResponse"][value="YES"]').check();
    await expect(page.locator('input[type="radio"][name="attendanceResponse"][value="YES"]')).toBeChecked();
    await page.getByLabel("Telefon").fill("+49 151 5551234");
    await page.getByLabel("Ernaehrungsanforderungen").fill("Vegetarisch");
    await page.getByLabel("Barrierefreiheit / Accessibility").fill("Keine");
    await page.getByLabel("Anreise").fill("Anreise am Vortag mit der Bahn");
    await page.getByLabel("Abreise").fill("Rueckreise am Folgetag");

    await page.getByLabel(PHOTO_CONSENT_LABEL).check();
    await page.getByRole("button", { name: "Registrierung abschliessen" }).click();

    await expect(page).toHaveURL(new RegExp(`/invite/${invitation.rawToken}/confirmation$`));
    await expect(page.getByRole("heading", { name: "Vielen Dank fuer Ihre Rueckmeldung" })).toBeVisible();

    const storedAttendee = await waitForAttendeeStatus(request, invitation.attendee.email);
    expect(storedAttendee.attendee.registrationStatus).toBe("COMPLETED");
    expect(storedAttendee.attendee.attendanceResponse).toBe("YES");
    expect(storedAttendee.attendee.checkedInAt).toBeNull();
    expect(storedAttendee.attendee.invitationStatus).toBe("REGISTERED");

    await signInWithMagicLink(page, request, invitation.attendee.email, "guest");
    await expect(page.getByRole("heading", { name: `Willkommen, ${invitation.attendee.firstName}` })).toBeVisible();
  });
});
