import type { APIRequestContext } from "@playwright/test";

type InvitationFixtureResponse = {
  attendee: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  rawToken: string;
  eventId: string;
};

type VerificationTokenResponse = {
  token: string;
};

type AttendeeStatusResponse = {
  attendee: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    registrationStatus: string;
    attendanceResponse: string;
    checkedInAt: string | null;
    invitationStatus: string;
    sessionSelectionCount: number;
    registrationId: string | null;
    invitationId: string | null;
  };
};

async function expectJson<T>(response: { ok(): boolean; json(): Promise<unknown>; text(): Promise<string> }) {
  if (!response.ok()) {
    throw new Error(`Request failed: ${await response.text()}`);
  }

  const body = (await response.json()) as T;
  return body;
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function createInvitationFixture(
  request: APIRequestContext,
  options?: {
    firstName?: string;
    lastName?: string;
    emailPrefix?: string;
  },
) {
  const response = await request.post("/api/test/fixtures/invitations", {
    data: options ?? {},
  });

  return expectJson<InvitationFixtureResponse>(response);
}

export async function waitForVerificationToken(request: APIRequestContext, email: string, timeoutMs = 10_000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const response = await request.get(`/api/test/verification-token?email=${encodeURIComponent(email)}`);

    if (response.ok()) {
      return expectJson<VerificationTokenResponse>(response);
    }

    await sleep(250);
  }

  throw new Error(`No verification token found for ${email}`);
}

export async function waitForAttendeeStatus(request: APIRequestContext, email: string, timeoutMs = 10_000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const response = await request.get(`/api/test/attendees?email=${encodeURIComponent(email)}`);

    if (response.ok()) {
      return expectJson<AttendeeStatusResponse>(response);
    }

    await sleep(250);
  }

  throw new Error(`No attendee status found for ${email}`);
}
