import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  user: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    update: vi.fn(),
  },
  attendee: {
    findFirst: vi.fn(),
  },
  account: {
    create: vi.fn(),
    deleteMany: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
  },
  session: {
    create: vi.fn(),
    deleteMany: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
  },
  verificationToken: {
    create: vi.fn(),
    deleteMany: vi.fn(),
    findUnique: vi.fn(),
  },
}));

const observabilityMock = vi.hoisted(() => ({
  logPilotEvent: vi.fn(),
  reportPilotError: vi.fn(),
}));

const mailerMock = vi.hoisted(() => ({
  sendTransactionalEmail: vi.fn(),
}));

vi.mock("next-auth/providers/email", () => ({
  default: () => ({
    id: "email",
    type: "email",
    name: "Email",
  }),
}));
vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));
vi.mock("@/lib/observability", () => observabilityMock);
vi.mock("@/lib/email/mailer", () => mailerMock);
vi.mock("@/lib/email/templates", () => ({
  MagicLinkEmailTemplate: () => null,
}));

import { authOptions } from "@/lib/auth";

type JwtCallback = NonNullable<NonNullable<typeof authOptions.callbacks>["jwt"]>;
type SignInCallback = NonNullable<NonNullable<typeof authOptions.callbacks>["signIn"]>;
type JwtArgs = Parameters<JwtCallback>[0];
type SignInArgs = Parameters<SignInCallback>[0];

describe("auth", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("invalidates stale JWT sessions when the user loses access", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(null);
    prismaMock.user.findUnique.mockResolvedValueOnce(null);

    const token = {
      sub: "user-1",
      email: "admin@example.com",
      name: "Admin",
      kind: "ADMIN",
      roles: ["SUPER_ADMIN"],
      attendeeId: "attendee-1",
      eventId: "event-1",
    } as JwtArgs["token"];

    const result = await authOptions.callbacks!.jwt!({
      token,
      user: { id: "user-1" } as JwtArgs["user"],
    } as JwtArgs);

    expect(result.sub).toBeUndefined();
    expect(result.email).toBeUndefined();
    expect(result.kind).toBeUndefined();
    expect(result.roles).toEqual([]);
    expect(result.attendeeId).toBeNull();
    expect(result.eventId).toBeNull();
  });

  it("denies magic-link sign in when no attendee or admin membership exists", async () => {
    prismaMock.attendee.findFirst.mockResolvedValueOnce(null);
    prismaMock.user.findFirst.mockResolvedValueOnce(null);

    const allowed = await authOptions.callbacks!.signIn!(
      {
        user: { email: "someone@example.com" } as SignInArgs["user"],
        account: { provider: "email" } as SignInArgs["account"],
      } as SignInArgs,
    );

    expect(allowed).toBe(false);
    expect(observabilityMock.logPilotEvent).toHaveBeenCalledWith(
      "warn",
      "auth.magic_link.denied",
      expect.any(String),
      expect.objectContaining({ email: "someone@example.com" }),
    );
  });
});
