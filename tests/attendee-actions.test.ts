import { FeedbackRating, FeedbackType } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  attendee: {
    findUniqueOrThrow: vi.fn(),
  },
  sessionModel: {
    findUniqueOrThrow: vi.fn(),
  },
  sessionSelection: {
    upsert: vi.fn(),
    deleteMany: vi.fn(),
    findUnique: vi.fn(),
  },
  feedback: {
    create: vi.fn(),
  },
}));

const authMock = vi.hoisted(() => ({
  requireAttendeeSession: vi.fn(),
}));

const mailerMock = vi.hoisted(() => ({
  sendTransactionalEmail: vi.fn(),
}));

const auditMock = vi.hoisted(() => ({
  createAuditLog: vi.fn(),
}));

const dataMock = vi.hoisted(() => ({
  getInvitationContext: vi.fn(),
}));

const cacheMock = vi.hoisted(() => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));
vi.mock("@/lib/auth", () => authMock);
vi.mock("@/lib/email/mailer", () => mailerMock);
vi.mock("@/lib/email/templates", () => ({
  AnnouncementEmailTemplate: () => null,
  RegistrationConfirmationEmailTemplate: () => null,
  RegistrationUpdateEmailTemplate: () => null,
}));
vi.mock("@/lib/audit", () => auditMock);
vi.mock("@/lib/data", () => dataMock);
vi.mock("next/cache", () => cacheMock);

import { submitFeedbackAction, toggleSessionSelectionAction } from "@/actions/attendee";

describe("attendee actions", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("binds session selection updates to the logged-in attendee", async () => {
    authMock.requireAttendeeSession.mockResolvedValueOnce({
      user: {
        attendeeId: "attendee-1",
        eventId: "event-1",
      },
    });

    prismaMock.attendee.findUniqueOrThrow.mockResolvedValueOnce({
      id: "attendee-1",
      eventId: "event-1",
      email: "anna@example.com",
    });

    prismaMock.sessionModel.findUniqueOrThrow.mockResolvedValueOnce({
      id: "session-1",
      eventId: "event-1",
      title: "Keynote",
      selectionEnabled: true,
      capacity: 10,
      selections: [],
    });

    prismaMock.sessionSelection.upsert.mockResolvedValueOnce({ id: "selection-1" });
    auditMock.createAuditLog.mockResolvedValueOnce(undefined);

    const result = await toggleSessionSelectionAction("session-1", true);

    expect(result.ok).toBe(true);
    expect(prismaMock.sessionSelection.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          attendeeId: "attendee-1",
          sessionId: "session-1",
        }),
      }),
    );
  });

  it("rejects feedback for sessions outside the attendee agenda", async () => {
    authMock.requireAttendeeSession.mockResolvedValueOnce({
      user: {
        attendeeId: "attendee-1",
        eventId: "event-1",
      },
    });

    prismaMock.attendee.findUniqueOrThrow.mockResolvedValueOnce({
      id: "attendee-1",
      eventId: "event-1",
      email: "anna@example.com",
      sessionSelections: [{ sessionId: "session-1" }],
    });

    const result = await submitFeedbackAction({
      type: FeedbackType.SESSION,
      sessionId: "session-2",
      rating: FeedbackRating.GOOD,
      comment: "Gut",
    });

    expect(result.ok).toBe(false);
    expect(String(result.message)).toContain("persönlichen Agenda");
    expect(prismaMock.feedback.create).not.toHaveBeenCalled();
  });

  it("stores event feedback for the logged-in attendee", async () => {
    authMock.requireAttendeeSession.mockResolvedValueOnce({
      user: {
        attendeeId: "attendee-7",
        eventId: "event-9",
      },
    });

    prismaMock.attendee.findUniqueOrThrow.mockResolvedValueOnce({
      id: "attendee-7",
      eventId: "event-9",
      email: "guest@example.com",
      sessionSelections: [],
    });

    mailerMock.sendTransactionalEmail.mockResolvedValueOnce({ data: { id: "mail-1" } });
    prismaMock.feedback.create.mockResolvedValueOnce({ id: "feedback-1" });

    const result = await submitFeedbackAction({
      type: FeedbackType.EVENT,
      rating: FeedbackRating.EXCELLENT,
      comment: "Sehr gut",
    });

    expect(result.ok).toBe(true);
    expect(prismaMock.feedback.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        attendeeId: "attendee-7",
        eventId: "event-9",
        sessionId: null,
        type: FeedbackType.EVENT,
      }),
    });
    expect(mailerMock.sendTransactionalEmail).toHaveBeenCalledTimes(1);
  });
});
