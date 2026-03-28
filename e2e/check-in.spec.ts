import { expect, test } from "@playwright/test";

import { signInWithMagicLink } from "./support/auth";
import { createInvitationFixture, waitForAttendeeStatus } from "./support/db";

test.describe("check-in operations", () => {
  test("check-in staff can search and check in an attendee", async ({ page, request }) => {
    await signInWithMagicLink(page, request, "max.checkin@conferencecompanion.example", "admin");
    await expect(page).toHaveURL(/\/admin$/);

    const candidate = await createInvitationFixture(request, {
      firstName: "Lea",
      lastName: "Schubert",
      emailPrefix: "e2e-checkin",
    });

    await page.goto("/check-in");
    await expect(page.getByRole("heading", { name: "Live Check-in" })).toBeVisible();

    await page.getByPlaceholder("Teilnehmer suchen").fill(candidate.attendee.firstName);
    await page.locator("button").filter({ hasText: candidate.attendee.firstName }).first().click();
    await page.getByRole("button", { name: "Check-in bestaetigen" }).click();

    await expect(page.getByText("wurde erfolgreich eingecheckt")).toBeVisible();

    const updated = await waitForAttendeeStatus(request, candidate.attendee.email);
    expect(updated.attendee.checkedInAt).not.toBeNull();
  });
});
