import { expect, type APIRequestContext, type Page } from "@playwright/test";

import { waitForVerificationToken } from "./db";

export async function signInWithMagicLink(page: Page, request: APIRequestContext, email: string, expectedRole: "admin" | "guest") {
  await request.delete(`/api/test/verification-token?email=${encodeURIComponent(email)}`);
  await page.goto("/login");
  await page.getByLabel("E-Mail-Adresse").fill(email);
  await page.getByRole("button", { name: "Magic Link anfordern" }).click();

  const token = await waitForVerificationToken(request, email);

  await page.goto(
    `/api/auth/callback/email?callbackUrl=${encodeURIComponent("/login/redirect")}&token=${encodeURIComponent(token.token)}&email=${encodeURIComponent(email)}`,
  );

  if (expectedRole === "admin") {
    await expect(page).toHaveURL(/\/admin$/);
  } else {
    await expect(page).toHaveURL(/\/guest$/);
  }
}
