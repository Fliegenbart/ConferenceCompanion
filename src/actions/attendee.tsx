"use server";

import { AttendanceResponse, EmailType, FeedbackType, InvitationStatus, RegistrationStatus, SessionSelectionStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { createElement } from "react";

import { createAuditLog } from "@/lib/audit";
import { CONSENT_VERSION } from "@/lib/constants";
import { requireAttendeeSession } from "@/lib/auth";
import { getInvitationContext } from "@/lib/data";
import { sendTransactionalEmail } from "@/lib/email/mailer";
import {
  AnnouncementEmailTemplate,
  RegistrationConfirmationEmailTemplate,
  RegistrationUpdateEmailTemplate,
} from "@/lib/email/templates";
import { prisma } from "@/lib/prisma";
import { assertRateLimit } from "@/lib/rate-limit";
import { feedbackSchema, registrationSchema } from "@/lib/validations";

type ActionResult = {
  ok: boolean;
  message: string;
  redirectTo?: string;
};

export async function submitRegistrationAction(token: string, payload: unknown): Promise<ActionResult> {
  try {
    await assertRateLimit(`registration:${token}`, 8, 5 * 60 * 1000);
    const parsed = registrationSchema.safeParse(payload);

    if (!parsed.success) {
      return {
        ok: false,
        message: parsed.error.issues[0]?.message ?? "Bitte prüfen Sie Ihre Eingaben.",
      };
    }

    const invitation = await getInvitationContext(token);

    if (!invitation?.attendee) {
      return {
        ok: false,
        message: "Der Einladungslink ist ungültig oder bereits abgelaufen.",
      };
    }

    if (invitation.expiresAt && invitation.expiresAt < new Date()) {
      return {
        ok: false,
        message: "Der Einladungslink ist abgelaufen.",
      };
    }

    const attendee = await prisma.$transaction(async (tx) => {
      for (const sessionId of parsed.data.selectedSessionIds) {
        const session = await tx.sessionModel.findUnique({
          where: { id: sessionId },
          include: {
            selections: {
              where: {
                status: SessionSelectionStatus.CONFIRMED,
              },
            },
          },
        });

        if (!session || !session.selectionEnabled) {
          continue;
        }

        const existingSelection = await tx.sessionSelection.findUnique({
          where: {
            attendeeId_sessionId: {
              attendeeId: invitation.attendee.id,
              sessionId,
            },
          },
        });

        if (session.capacity && !existingSelection && session.selections.length >= session.capacity) {
        throw new Error(`Die Sitzung "${session.title}" ist derzeit ausgebucht. Eine Warteliste folgt in einer späteren Version.`);
        }
      }

      const registrationStatus =
        parsed.data.attendanceResponse === AttendanceResponse.NO ? RegistrationStatus.DECLINED : RegistrationStatus.COMPLETED;
      const invitationStatus =
        parsed.data.attendanceResponse === AttendanceResponse.NO ? InvitationStatus.DECLINED : InvitationStatus.REGISTERED;

      const updatedAttendee = await tx.attendee.update({
        where: { id: invitation.attendee.id },
        data: {
          phone: parsed.data.phone,
          attendanceResponse: parsed.data.attendanceResponse,
          dietaryRequirements: parsed.data.dietaryRequirements,
          accessibilityNeeds: parsed.data.accessibilityNeeds,
          hotelRequired: parsed.data.hotelRequired,
          arrivalInfo: parsed.data.arrivalInfo,
          departureInfo: parsed.data.departureInfo,
          registrationStatus,
          invitationStatus,
          registeredAt: new Date(),
          invitation: {
            update: {
              status: invitationStatus,
              openedAt: invitation.openedAt ?? new Date(),
            },
          },
          registration: {
            upsert: {
              create: {
                status: registrationStatus,
                attendanceResponse: parsed.data.attendanceResponse,
                phone: parsed.data.phone,
                dietaryRequirements: parsed.data.dietaryRequirements,
                accessibilityNeeds: parsed.data.accessibilityNeeds,
                hotelRequired: parsed.data.hotelRequired,
                arrivalInfo: parsed.data.arrivalInfo,
                departureInfo: parsed.data.departureInfo,
                workshopNotes: parsed.data.workshopNotes,
                privacyAccepted: parsed.data.privacyAccepted,
                photoConsentAccepted: parsed.data.photoConsentAccepted,
              },
              update: {
                status:
                  invitation.attendee.registrationStatus === RegistrationStatus.PENDING
                    ? registrationStatus
                    : RegistrationStatus.UPDATED,
                attendanceResponse: parsed.data.attendanceResponse,
                phone: parsed.data.phone,
                dietaryRequirements: parsed.data.dietaryRequirements,
                accessibilityNeeds: parsed.data.accessibilityNeeds,
                hotelRequired: parsed.data.hotelRequired,
                arrivalInfo: parsed.data.arrivalInfo,
                departureInfo: parsed.data.departureInfo,
                workshopNotes: parsed.data.workshopNotes,
                privacyAccepted: parsed.data.privacyAccepted,
                photoConsentAccepted: parsed.data.photoConsentAccepted,
              },
            },
          },
        },
        include: {
          event: true,
          registration: true,
        },
      });

      await tx.consentRecord.deleteMany({
        where: {
          attendeeId: invitation.attendee.id,
        },
      });

      await tx.consentRecord.createMany({
        data: [
          {
            attendeeId: invitation.attendee.id,
            registrationId: updatedAttendee.registration?.id ?? undefined,
            consentKey: "privacy_policy",
            accepted: true,
            version: CONSENT_VERSION,
          },
          {
            attendeeId: invitation.attendee.id,
            registrationId: updatedAttendee.registration?.id ?? undefined,
            consentKey: "photo_video",
            accepted: parsed.data.photoConsentAccepted,
            version: CONSENT_VERSION,
          },
        ],
      });

      await tx.sessionSelection.deleteMany({
        where: {
          attendeeId: invitation.attendee.id,
        },
      });

      if (parsed.data.attendanceResponse === AttendanceResponse.YES && parsed.data.selectedSessionIds.length) {
        await tx.sessionSelection.createMany({
          data: parsed.data.selectedSessionIds.map((sessionId) => ({
            attendeeId: invitation.attendee.id,
            sessionId,
            status: SessionSelectionStatus.CONFIRMED,
          })),
        });
      }

      return updatedAttendee;
    });

    const summary = [
      `Teilnahme: ${parsed.data.attendanceResponse === AttendanceResponse.YES ? "zugesagt" : "abgesagt"}`,
      `Hotel benötigt: ${parsed.data.hotelRequired ? "Ja" : "Nein"}`,
      "Datenschutz bestätigt: Ja",
      `Foto-/Videoeinwilligung: ${parsed.data.photoConsentAccepted ? "Ja" : "Nein"}`,
    ];

    const attendeePortalUrl = `${process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/login?email=${encodeURIComponent(attendee.email)}`;

    await sendTransactionalEmail({
      attendeeId: attendee.id,
      eventId: attendee.eventId,
      to: attendee.email,
      subject: `Ihre Registrierung für ${attendee.event.name}`,
      type:
        invitation.attendee.registrationStatus === RegistrationStatus.PENDING
          ? EmailType.REGISTRATION_CONFIRMATION
          : EmailType.REGISTRATION_UPDATE,
      react:
        invitation.attendee.registrationStatus === RegistrationStatus.PENDING
          ? createElement(RegistrationConfirmationEmailTemplate, {
              attendeeName: `${attendee.firstName} ${attendee.lastName}`,
              eventName: attendee.event.name,
              summary,
              ctaHref: attendeePortalUrl,
            })
          : createElement(RegistrationUpdateEmailTemplate, {
              attendeeName: `${attendee.firstName} ${attendee.lastName}`,
              eventName: attendee.event.name,
              ctaHref: attendeePortalUrl,
            }),
    });

    await createAuditLog({
      eventId: attendee.eventId,
      entityType: "registration",
      entityId: attendee.id,
      action: "submitted",
      summary: `Registrierung für ${attendee.email} gespeichert`,
      payload: {
        attendanceResponse: parsed.data.attendanceResponse,
      },
    });

    revalidatePath(`/invite/${token}`);
    revalidatePath(`/invite/${token}/confirmation`);
    revalidatePath("/admin");
    revalidatePath("/admin/attendees");

    return {
      ok: true,
      message: "Ihre Registrierung wurde gespeichert.",
      redirectTo: `/invite/${token}/confirmation`,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Registrierung konnte nicht gespeichert werden.",
    };
  }
}

export async function toggleSessionSelectionAction(sessionId: string, select: boolean): Promise<ActionResult> {
  try {
    const attendeeSession = await requireAttendeeSession();
    const attendeeId = attendeeSession.user.attendeeId;

    if (!attendeeId) {
      return {
        ok: false,
        message: "Der Zugriff auf die Sitzungsauswahl ist nicht verfügbar.",
      };
    }

    const attendee = await prisma.attendee.findUniqueOrThrow({
      where: { id: attendeeId },
    });

    const selectedSession = await prisma.sessionModel.findUniqueOrThrow({
      where: { id: sessionId },
      include: {
        selections: {
          where: {
            status: SessionSelectionStatus.CONFIRMED,
          },
        },
      },
    });

    if (selectedSession.eventId !== attendee.eventId) {
      return {
        ok: false,
        message: "Die Sitzung gehört nicht zu Ihrer Veranstaltung.",
      };
    }

    if (!selectedSession.selectionEnabled) {
      return {
        ok: false,
        message: "Die Sitzungsauswahl ist für dieses Format deaktiviert.",
      };
    }

    if (select && selectedSession.capacity && selectedSession.selections.length >= selectedSession.capacity) {
      return {
        ok: false,
        message: "Diese Sitzung ist derzeit ausgebucht. Die Warteliste wird später ergänzt.",
      };
    }

    if (select) {
      await prisma.sessionSelection.upsert({
        where: {
          attendeeId_sessionId: {
            attendeeId,
            sessionId,
          },
        },
        update: {
          status: SessionSelectionStatus.CONFIRMED,
        },
        create: {
          attendeeId,
          sessionId,
          status: SessionSelectionStatus.CONFIRMED,
        },
      });
    } else {
      await prisma.sessionSelection.deleteMany({
        where: {
          attendeeId,
          sessionId,
        },
      });
    }

    await createAuditLog({
      eventId: attendee.eventId,
      entityType: "session_selection",
      entityId: sessionId,
      action: select ? "selected" : "deselected",
      summary: `${attendee.email} hat ${selectedSession.title} ${select ? "gewählt" : "entfernt"}`,
    });

    revalidatePath("/guest/agenda");
    revalidatePath("/guest/my-agenda");
    revalidatePath("/admin/agenda");

    return {
      ok: true,
      message: select ? "Sitzung wurde hinzugefügt." : "Sitzung wurde entfernt.",
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Die Sitzungsauswahl konnte nicht aktualisiert werden.",
    };
  }
}

export async function submitFeedbackAction(payload: unknown): Promise<ActionResult> {
  try {
    const parsed = feedbackSchema.safeParse(payload);

    if (!parsed.success) {
      return {
        ok: false,
        message: parsed.error.issues[0]?.message ?? "Bitte prüfen Sie Ihre Eingaben.",
      };
    }

    const attendeeSession = await requireAttendeeSession();
    const resolvedAttendeeId = attendeeSession.user.attendeeId;

    if (!resolvedAttendeeId) {
      return {
        ok: false,
        message: "Der Zugriff auf die Rückmeldung ist nicht verfügbar.",
      };
    }

    const attendee = await prisma.attendee.findUniqueOrThrow({
      where: { id: resolvedAttendeeId },
      include: {
        sessionSelections: true,
      },
    });

    if (
      parsed.data.type === FeedbackType.SESSION &&
      parsed.data.sessionId &&
      !attendee.sessionSelections.some((selection) => selection.sessionId === parsed.data.sessionId)
    ) {
      return {
        ok: false,
        message: "Bitte wählen Sie nur Sitzungen aus Ihrer persönlichen Agenda aus.",
      };
    }

    await prisma.feedback.create({
      data: {
        attendeeId: resolvedAttendeeId,
        eventId: attendee.eventId,
        sessionId: parsed.data.type === FeedbackType.SESSION ? parsed.data.sessionId : null,
        type: parsed.data.type,
        rating: parsed.data.rating,
        comment: parsed.data.comment,
      },
    });

    await sendTransactionalEmail({
      attendeeId: resolvedAttendeeId,
      eventId: attendee.eventId,
      to: attendee.email,
      subject: "Vielen Dank für Ihre Rückmeldung",
      type: EmailType.ANNOUNCEMENT,
      react: createElement(AnnouncementEmailTemplate, {
        title: "Vielen Dank für Ihre Rückmeldung",
        body: "Ihre Rückmeldung hilft uns, die nächsten Event-Erlebnisse noch gezielter weiterzuentwickeln.",
        ctaHref: `${process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/guest/feedback`,
      }),
    });

    revalidatePath("/guest/feedback");

    return {
      ok: true,
      message: "Vielen Dank für Ihre Rückmeldung.",
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Rückmeldung konnte nicht gespeichert werden.",
    };
  }
}
