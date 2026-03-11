import { AttendanceResponse, InvitationStatus, RegistrationStatus } from "@prisma/client";

import { DEFAULT_EVENT_SLUG } from "@/lib/constants";
import { hashToken } from "@/lib/tokens";
import { prisma } from "@/lib/prisma";

export async function getCurrentEvent(slug = DEFAULT_EVENT_SLUG) {
  try {
    return await prisma.event.findFirst({
      where: { slug },
    });
  } catch (error) {
    console.warn("Falling back to static event shell because the database is unavailable.", error);
    return null;
  }
}

export async function getCurrentEventOrThrow(slug = DEFAULT_EVENT_SLUG) {
  return prisma.event.findFirstOrThrow({
    where: { slug },
  });
}

export async function getInvitationContext(token: string) {
  const invitation = await prisma.invitation.findUnique({
    where: {
      tokenHash: hashToken(token),
    },
    include: {
      attendee: {
        include: {
          event: true,
          registration: true,
          sessionSelections: true,
        },
      },
    },
  });

  if (!invitation) {
    return null;
  }

  return invitation;
}

export async function getAttendeePortal(attendeeId: string) {
  return prisma.attendee.findUnique({
    where: { id: attendeeId },
    include: {
      event: {
        include: {
          announcements: {
            orderBy: [{ pinned: "desc" }, { publishedAt: "desc" }],
          },
          sessions: {
            include: {
              room: true,
              speakers: true,
              selections: true,
            },
            orderBy: {
              startAt: "asc",
            },
          },
          speakers: true,
          downloads: true,
          venueInfo: {
            orderBy: { sortOrder: "asc" },
          },
          faqItems: {
            orderBy: { sortOrder: "asc" },
          },
        },
      },
      registration: true,
      sessionSelections: {
        include: {
          session: {
            include: {
              room: true,
              speakers: true,
              selections: true,
            },
          },
        },
      },
      feedback: {
        orderBy: { createdAt: "desc" },
      },
      checkIns: {
        orderBy: { occurredAt: "desc" },
      },
    },
  });
}

export async function getAdminDashboard(eventId: string) {
  const [invited, registered, declined, checkedIn, attendees, sessions, recentLogs] = await Promise.all([
    prisma.attendee.count({
      where: {
        eventId,
        invitationStatus: {
          in: [InvitationStatus.SENT, InvitationStatus.OPENED, InvitationStatus.REGISTERED],
        },
      },
    }),
    prisma.attendee.count({
      where: {
        eventId,
        registrationStatus: {
          in: [RegistrationStatus.COMPLETED, RegistrationStatus.UPDATED],
        },
      },
    }),
    prisma.attendee.count({
      where: {
        eventId,
        attendanceResponse: AttendanceResponse.NO,
      },
    }),
    prisma.attendee.count({
      where: {
        eventId,
        checkedInAt: {
          not: null,
        },
      },
    }),
    prisma.attendee.findMany({
      where: { eventId },
      orderBy: [{ registrationStatus: "asc" }, { lastName: "asc" }],
      include: {
        invitation: true,
        registration: true,
        sessionSelections: true,
        checkIns: {
          orderBy: { occurredAt: "desc" },
          take: 1,
        },
      },
    }),
    prisma.sessionModel.findMany({
      where: { eventId },
      include: {
        room: true,
        speakers: true,
        selections: true,
      },
      orderBy: { startAt: "asc" },
    }),
    prisma.auditLog.findMany({
      where: { eventId },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  return {
    invited,
    registered,
    declined,
    checkedIn,
    attendees,
    sessions,
    recentLogs,
  };
}

export async function getAdminContent(eventId: string) {
  const [event, announcements, venueInfo, faqItems, downloads, emailLogs] = await Promise.all([
    prisma.event.findUniqueOrThrow({
      where: { id: eventId },
    }),
    prisma.announcement.findMany({
      where: { eventId },
      orderBy: [{ pinned: "desc" }, { publishedAt: "desc" }],
    }),
    prisma.venueInfo.findMany({
      where: { eventId },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.faqItem.findMany({
      where: { eventId },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.downloadAsset.findMany({
      where: { eventId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.emailLog.findMany({
      where: { eventId },
      orderBy: { sentAt: "desc" },
      take: 12,
    }),
  ]);

  return {
    event,
    announcements,
    venueInfo,
    faqItems,
    downloads,
    emailLogs,
  };
}

export async function getAdminAgenda(eventId: string) {
  const [sessions, rooms, speakers] = await Promise.all([
    prisma.sessionModel.findMany({
      where: { eventId },
      include: {
        room: true,
        speakers: true,
        selections: true,
      },
      orderBy: { startAt: "asc" },
    }),
    prisma.room.findMany({
      where: { eventId },
      orderBy: { name: "asc" },
    }),
    prisma.speaker.findMany({
      where: { eventId },
      orderBy: { name: "asc" },
    }),
  ]);

  return {
    sessions,
    rooms,
    speakers,
  };
}

export async function getMessagingData(eventId: string) {
  const [logs, attendees] = await Promise.all([
    prisma.emailLog.findMany({
      where: {
        eventId,
      },
      orderBy: { sentAt: "desc" },
      take: 40,
    }),
    prisma.attendee.findMany({
      where: { eventId },
      select: {
        id: true,
        hotelRequired: true,
        checkedInAt: true,
        attendanceResponse: true,
      },
    }),
  ]);

  return {
    logs,
    audiences: {
      all: attendees.length,
      registered: attendees.filter((attendee) => attendee.attendanceResponse === AttendanceResponse.YES).length,
      declined: attendees.filter((attendee) => attendee.attendanceResponse === AttendanceResponse.NO).length,
      checkedIn: attendees.filter((attendee) => attendee.checkedInAt).length,
      hotel: attendees.filter((attendee) => attendee.hotelRequired).length,
    },
  };
}

export async function getCheckInDashboard(eventId: string) {
  const [event, checkedInCount, attendees, recentCheckIns] = await Promise.all([
    prisma.event.findUniqueOrThrow({
      where: { id: eventId },
    }),
    prisma.attendee.count({
      where: {
        eventId,
        checkedInAt: {
          not: null,
        },
      },
    }),
    prisma.attendee.findMany({
      where: { eventId },
      orderBy: { lastName: "asc" },
      include: {
        checkIns: {
          orderBy: { occurredAt: "desc" },
          take: 1,
        },
      },
    }),
    prisma.checkIn.findMany({
      where: { eventId },
      include: {
        attendee: true,
      },
      orderBy: { occurredAt: "desc" },
      take: 10,
    }),
  ]);

  return {
    event,
    checkedInCount,
    attendees,
    recentCheckIns,
  };
}
