"use server";

import { AdminRole, CheckInMethod, CheckInStatus, EmailType, InvitationStatus, RegistrationStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";
import { getCurrentEventOrThrow } from "@/lib/data";
import { sendTransactionalEmail } from "@/lib/email/mailer";
import {
  AnnouncementEmailTemplate,
  InvitationEmailTemplate,
  RegistrationConfirmationEmailTemplate,
  ReminderEmailTemplate,
} from "@/lib/email/templates";
import { prisma } from "@/lib/prisma";
import { absoluteUrl } from "@/lib/utils";
import {
  announcementSchema,
  attendeeInviteSchema,
  downloadSchema,
  eventSettingsSchema,
  faqSchema,
  messageSchema,
  sessionSchema,
  venueInfoSchema,
} from "@/lib/validations";
import { createCheckInToken, generateInvitationToken, hashToken, verifyCheckInToken } from "@/lib/tokens";

function isTruthy(value: FormDataEntryValue | null) {
  return value === "on" || value === "true" || value === "1";
}

async function issueInvitation(attendeeId: string, actorUserId?: string | null) {
  const attendee = await prisma.attendee.findUniqueOrThrow({
    where: { id: attendeeId },
    include: {
      event: true,
      invitation: true,
    },
  });

  const token = generateInvitationToken();
  const invitationLink = absoluteUrl(`/invite/${token}`);

  if (attendee.invitation) {
    await prisma.invitation.update({
      where: { attendeeId },
      data: {
        tokenHash: hashToken(token),
        tokenLastFour: token.slice(-4),
        status: InvitationStatus.SENT,
        sentAt: new Date(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      },
    });
  } else {
    await prisma.invitation.create({
      data: {
        attendeeId,
        tokenHash: hashToken(token),
        tokenLastFour: token.slice(-4),
        status: InvitationStatus.SENT,
        sentAt: new Date(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      },
    });
  }

  await prisma.attendee.update({
    where: { id: attendeeId },
    data: {
      invitationStatus: InvitationStatus.SENT,
      invitedAt: new Date(),
      lastNotifiedAt: new Date(),
    },
  });

  await sendTransactionalEmail({
    attendeeId,
    eventId: attendee.eventId,
    to: attendee.email,
    subject: `Einladung zur ${attendee.event.name}`,
    type: EmailType.INVITATION,
    react: (
      <InvitationEmailTemplate
        attendeeName={`${attendee.firstName} ${attendee.lastName}`}
        eventName={attendee.event.name}
        eventDate={`${attendee.event.startDate.toLocaleDateString("de-DE")} - ${attendee.event.endDate.toLocaleDateString("de-DE")}`}
        ctaHref={invitationLink}
      />
    ),
  });

  await createAuditLog({
    actorUserId: actorUserId ?? null,
    eventId: attendee.eventId,
    entityType: "invitation",
    entityId: attendeeId,
    action: attendee.invitation ? "resent" : "created",
    summary: `Einladung fuer ${attendee.email} versendet`,
  });
}

async function sendConfirmation(attendeeId: string, actorUserId?: string | null) {
  const attendee = await prisma.attendee.findUniqueOrThrow({
    where: { id: attendeeId },
    include: {
      event: true,
    },
  });

  const qrToken = await createCheckInToken({
    attendeeId: attendee.id,
    eventId: attendee.eventId,
    email: attendee.email,
  });

  await sendTransactionalEmail({
    attendeeId,
    eventId: attendee.eventId,
    to: attendee.email,
    subject: "Ihre Registrierungsbestaetigung",
    type: EmailType.REGISTRATION_CONFIRMATION,
    react: (
      <RegistrationConfirmationEmailTemplate
        attendeeName={`${attendee.firstName} ${attendee.lastName}`}
        eventName={attendee.event.name}
        summary={[
          `Teilnahme: ${attendee.attendanceResponse === "YES" ? "zugesagt" : attendee.attendanceResponse === "NO" ? "abgesagt" : "offen"}`,
          `Hotel benoetigt: ${attendee.hotelRequired ? "Ja" : "Nein"}`,
          "QR Check-in aktiviert",
        ]}
        ctaHref={absoluteUrl(`/guest/login?email=${encodeURIComponent(attendee.email)}`)}
      />
    ),
    metadata: { qrToken },
  });

  await prisma.attendee.update({
    where: { id: attendeeId },
    data: {
      lastNotifiedAt: new Date(),
    },
  });

  await createAuditLog({
    actorUserId: actorUserId ?? null,
    eventId: attendee.eventId,
    entityType: "registration_confirmation",
    entityId: attendeeId,
    action: "resent",
    summary: `Bestaetigung fuer ${attendee.email} erneut versendet`,
  });
}

export async function createAttendeeInviteAction(formData: FormData) {
  const session = await requireAdminSession();
  const event = await getCurrentEventOrThrow(session.user.eventId ?? undefined);

  const payload = attendeeInviteSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    company: formData.get("company"),
    title: formData.get("title"),
  });

  if (!payload.success) {
    return { ok: false, message: payload.error.issues[0]?.message ?? "Bitte pruefen Sie die Eingaben." };
  }

  const attendee = await prisma.attendee.create({
    data: {
      eventId: event.id,
      firstName: payload.data.firstName,
      lastName: payload.data.lastName,
      email: payload.data.email.toLowerCase(),
      company: payload.data.company,
      title: payload.data.title,
    },
  });

  await issueInvitation(attendee.id, session.user.id);
  revalidatePath("/admin");
  revalidatePath("/admin/attendees");

  return { ok: true, message: "Einladung erstellt und versendet." };
}

export async function resendInvitationAction(attendeeId: string) {
  const session = await requireAdminSession();
  await issueInvitation(attendeeId, session.user.id);
  revalidatePath("/admin/attendees");
  return { ok: true, message: "Einladung erneut versendet." };
}

export async function resendConfirmationAction(attendeeId: string) {
  const session = await requireAdminSession();
  await sendConfirmation(attendeeId, session.user.id);
  revalidatePath("/admin/attendees");
  return { ok: true, message: "Bestaetigung erneut versendet." };
}

export async function saveSessionAction(formData: FormData) {
  const session = await requireAdminSession();
  const event = await getCurrentEventOrThrow(session.user.eventId ?? undefined);

  const payload = sessionSchema.safeParse({
    id: formData.get("id") || undefined,
    title: formData.get("title"),
    subtitle: formData.get("subtitle") || undefined,
    description: formData.get("description"),
    category: formData.get("category") || undefined,
    tags: formData.get("tags") || undefined,
    startAt: formData.get("startAt"),
    endAt: formData.get("endAt"),
    roomId: formData.get("roomId") || undefined,
    capacity: formData.get("capacity") || undefined,
    featured: isTruthy(formData.get("featured")),
    selectionEnabled: isTruthy(formData.get("selectionEnabled")),
    speakerIds: formData.getAll("speakerIds").map(String),
  });

  if (!payload.success) {
    return { ok: false, message: payload.error.issues[0]?.message ?? "Session konnte nicht gespeichert werden." };
  }

  const data = {
    eventId: event.id,
    title: payload.data.title,
    subtitle: payload.data.subtitle,
    description: payload.data.description,
    category: payload.data.category,
    tags: payload.data.tags?.split(",").map((tag) => tag.trim()).filter(Boolean) ?? [],
    startAt: new Date(payload.data.startAt),
    endAt: new Date(payload.data.endAt),
    roomId: payload.data.roomId || null,
    capacity: payload.data.capacity || null,
    featured: payload.data.featured,
    selectionEnabled: payload.data.selectionEnabled,
    createdById: session.user.id,
  };

  if (payload.data.id) {
    await prisma.sessionModel.update({
      where: { id: payload.data.id },
      data: {
        ...data,
        speakers: {
          set: payload.data.speakerIds.map((id) => ({ id })),
        },
      },
    });
  } else {
    await prisma.sessionModel.create({
      data: {
        ...data,
        speakers: {
          connect: payload.data.speakerIds.map((id) => ({ id })),
        },
      },
    });
  }

  await createAuditLog({
    actorUserId: session.user.id,
    eventId: event.id,
    entityType: "session",
    entityId: payload.data.id ?? null,
    action: payload.data.id ? "updated" : "created",
    summary: `Session ${payload.data.title} gespeichert`,
  });

  revalidatePath("/admin/agenda");
  revalidatePath("/guest/agenda");
  revalidatePath("/guest/my-agenda");

  return { ok: true, message: "Session gespeichert." };
}

export async function deleteSessionAction(formData: FormData) {
  const session = await requireAdminSession();
  const id = String(formData.get("id"));
  await prisma.sessionModel.delete({ where: { id } });
  await createAuditLog({
    actorUserId: session.user.id,
    eventId: session.user.eventId,
    entityType: "session",
    entityId: id,
    action: "deleted",
    summary: `Session ${id} geloescht`,
  });
  revalidatePath("/admin/agenda");
  revalidatePath("/guest/agenda");
  return { ok: true, message: "Session geloescht." };
}

export async function saveAnnouncementAction(formData: FormData) {
  const session = await requireAdminSession();
  const event = await getCurrentEventOrThrow(session.user.eventId ?? undefined);
  const payload = announcementSchema.safeParse({
    id: formData.get("id") || undefined,
    title: formData.get("title"),
    body: formData.get("body"),
    audience: formData.get("audience") || "all",
    pinned: isTruthy(formData.get("pinned")),
  });

  if (!payload.success) {
    return { ok: false, message: payload.error.issues[0]?.message ?? "Announcement konnte nicht gespeichert werden." };
  }

  if (payload.data.id) {
    await prisma.announcement.update({
      where: { id: payload.data.id },
      data: payload.data,
    });
  } else {
    await prisma.announcement.create({
      data: {
        eventId: event.id,
        ...payload.data,
      },
    });
  }

  revalidatePath("/admin/content");
  revalidatePath("/guest/updates");
  revalidatePath("/guest");
  return { ok: true, message: "Announcement gespeichert." };
}

export async function deleteAnnouncementAction(formData: FormData) {
  await requireAdminSession();
  await prisma.announcement.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin/content");
  revalidatePath("/guest/updates");
  return { ok: true, message: "Announcement geloescht." };
}

export async function saveVenueInfoAction(formData: FormData) {
  const session = await requireAdminSession();
  const event = await getCurrentEventOrThrow(session.user.eventId ?? undefined);
  const payload = venueInfoSchema.safeParse({
    id: formData.get("id") || undefined,
    key: formData.get("key"),
    title: formData.get("title"),
    content: formData.get("content"),
    sortOrder: formData.get("sortOrder") || 0,
  });

  if (!payload.success) {
    return { ok: false, message: payload.error.issues[0]?.message ?? "Venue Info konnte nicht gespeichert werden." };
  }

  if (payload.data.id) {
    await prisma.venueInfo.update({
      where: { id: payload.data.id },
      data: payload.data,
    });
  } else {
    await prisma.venueInfo.create({
      data: {
        eventId: event.id,
        ...payload.data,
      },
    });
  }

  revalidatePath("/admin/content");
  revalidatePath("/guest/info");
  return { ok: true, message: "Venue Info gespeichert." };
}

export async function deleteVenueInfoAction(formData: FormData) {
  await requireAdminSession();
  await prisma.venueInfo.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin/content");
  revalidatePath("/guest/info");
  return { ok: true, message: "Venue Info geloescht." };
}

export async function saveFaqAction(formData: FormData) {
  const session = await requireAdminSession();
  const event = await getCurrentEventOrThrow(session.user.eventId ?? undefined);
  const payload = faqSchema.safeParse({
    id: formData.get("id") || undefined,
    question: formData.get("question"),
    answer: formData.get("answer"),
    sortOrder: formData.get("sortOrder") || 0,
  });

  if (!payload.success) {
    return { ok: false, message: payload.error.issues[0]?.message ?? "FAQ konnte nicht gespeichert werden." };
  }

  if (payload.data.id) {
    await prisma.faqItem.update({
      where: { id: payload.data.id },
      data: payload.data,
    });
  } else {
    await prisma.faqItem.create({
      data: {
        eventId: event.id,
        ...payload.data,
      },
    });
  }

  revalidatePath("/admin/content");
  revalidatePath("/guest/info");
  return { ok: true, message: "FAQ gespeichert." };
}

export async function deleteFaqAction(formData: FormData) {
  await requireAdminSession();
  await prisma.faqItem.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin/content");
  revalidatePath("/guest/info");
  return { ok: true, message: "FAQ geloescht." };
}

export async function saveDownloadAction(formData: FormData) {
  const session = await requireAdminSession();
  const event = await getCurrentEventOrThrow(session.user.eventId ?? undefined);
  const payload = downloadSchema.safeParse({
    id: formData.get("id") || undefined,
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    category: formData.get("category") || undefined,
    fileName: formData.get("fileName"),
    fileUrl: formData.get("fileUrl"),
  });

  if (!payload.success) {
    return { ok: false, message: payload.error.issues[0]?.message ?? "Download konnte nicht gespeichert werden." };
  }

  if (payload.data.id) {
    await prisma.downloadAsset.update({
      where: { id: payload.data.id },
      data: payload.data,
    });
  } else {
    await prisma.downloadAsset.create({
      data: {
        eventId: event.id,
        ...payload.data,
      },
    });
  }

  revalidatePath("/admin/content");
  revalidatePath("/guest/downloads");
  return { ok: true, message: "Download gespeichert." };
}

export async function deleteDownloadAction(formData: FormData) {
  await requireAdminSession();
  await prisma.downloadAsset.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin/content");
  revalidatePath("/guest/downloads");
  return { ok: true, message: "Download geloescht." };
}

export async function updateEventSettingsAction(formData: FormData) {
  const session = await requireAdminSession();
  const event = await getCurrentEventOrThrow(session.user.eventId ?? undefined);
  const payload = eventSettingsSchema.safeParse({
    registrationOpen: isTruthy(formData.get("registrationOpen")),
    attendeeSelectionOn: isTruthy(formData.get("attendeeSelectionOn")),
    confirmationText: formData.get("confirmationText") || undefined,
    privacyPolicyUrl: formData.get("privacyPolicyUrl") || undefined,
    legalNoticeUrl: formData.get("legalNoticeUrl") || undefined,
  });

  if (!payload.success) {
    return { ok: false, message: payload.error.issues[0]?.message ?? "Einstellungen konnten nicht gespeichert werden." };
  }

  await prisma.event.update({
    where: { id: event.id },
    data: payload.data,
  });

  revalidatePath("/admin/settings");
  revalidatePath("/guest/info");
  return { ok: true, message: "Einstellungen gespeichert." };
}

export async function sendAudienceMessageAction(formData: FormData) {
  const session = await requireAdminSession();
  const event = await getCurrentEventOrThrow(session.user.eventId ?? undefined);

  const payload = messageSchema.safeParse({
    subject: formData.get("subject"),
    body: formData.get("body"),
    audience: formData.get("audience"),
  });

  if (!payload.success) {
    return { ok: false, message: payload.error.issues[0]?.message ?? "Update konnte nicht versendet werden." };
  }

  const where =
    payload.data.audience === "registered"
      ? { attendanceResponse: "YES" as const }
      : payload.data.audience === "declined"
        ? { attendanceResponse: "NO" as const }
        : payload.data.audience === "checked_in"
          ? { checkedInAt: { not: null } }
          : payload.data.audience === "hotel"
            ? { hotelRequired: true }
            : {};

  const attendees = await prisma.attendee.findMany({
    where: {
      eventId: event.id,
      ...where,
    },
  });

  for (const attendee of attendees) {
    await sendTransactionalEmail({
      attendeeId: attendee.id,
      eventId: event.id,
      to: attendee.email,
      subject: payload.data.subject,
      type: EmailType.ANNOUNCEMENT,
      react: (
        <AnnouncementEmailTemplate
          title={payload.data.subject}
          body={payload.data.body}
          ctaHref={absoluteUrl("/guest/updates")}
        />
      ),
      metadata: {
        audience: payload.data.audience,
      },
    });
  }

  await createAuditLog({
    actorUserId: session.user.id,
    eventId: event.id,
    entityType: "message_broadcast",
    action: "sent",
    summary: `Update an ${attendees.length} Empfaenger versendet`,
    payload: payload.data,
  });

  revalidatePath("/admin/messaging");
  return { ok: true, message: `Update an ${attendees.length} Empfaenger versendet.` };
}

export async function sendReminderAction(attendeeId: string) {
  const session = await requireAdminSession();
  const attendee = await prisma.attendee.findUniqueOrThrow({
    where: { id: attendeeId },
    include: { event: true },
  });

  await sendTransactionalEmail({
    attendeeId,
    eventId: attendee.eventId,
    to: attendee.email,
    subject: "Erinnerung zur E.ON Vertriebskonferenz 2026",
    type: EmailType.REMINDER,
    react: (
      <ReminderEmailTemplate
        attendeeName={`${attendee.firstName} ${attendee.lastName}`}
        eventName={attendee.event.name}
        ctaHref={absoluteUrl(`/guest/login?email=${encodeURIComponent(attendee.email)}`)}
      />
    ),
  });

  await createAuditLog({
    actorUserId: session.user.id,
    eventId: attendee.eventId,
    entityType: "reminder",
    entityId: attendeeId,
    action: "sent",
    summary: `Erinnerung an ${attendee.email} versendet`,
  });

  revalidatePath("/admin/attendees");
  return { ok: true, message: "Erinnerung versendet." };
}

export async function processCheckInAction(input: { token?: string; attendeeId?: string; overrideReason?: string }) {
  const session = await requireAdminSession();
  const attendeeId = input.attendeeId || (input.token ? (await verifyCheckInToken(input.token)).attendeeId : null);

  if (!attendeeId) {
    return { ok: false, message: "Kein gueltiger QR-Code oder Teilnehmer ausgewaehlt." };
  }

  const attendee = await prisma.attendee.findUniqueOrThrow({
    where: { id: attendeeId },
  });

  if (attendee.checkedInAt && !input.overrideReason && !session.user.roles.includes(AdminRole.SUPER_ADMIN)) {
    return { ok: false, message: "Teilnehmer ist bereits eingecheckt. Fuer einen Override wird eine Begruendung benoetigt." };
  }

  await prisma.checkIn.create({
    data: {
      attendeeId,
      eventId: attendee.eventId,
      createdById: session.user.id,
      method: input.token ? CheckInMethod.QR : CheckInMethod.MANUAL,
      status: attendee.checkedInAt ? CheckInStatus.OVERRIDDEN : CheckInStatus.CHECKED_IN,
      overrideReason: input.overrideReason,
    },
  });

  await prisma.attendee.update({
    where: { id: attendeeId },
    data: {
      checkedInAt: new Date(),
      registrationStatus:
        attendee.registrationStatus === RegistrationStatus.PENDING ? RegistrationStatus.UPDATED : attendee.registrationStatus,
    },
  });

  await createAuditLog({
    actorUserId: session.user.id,
    eventId: attendee.eventId,
    entityType: "checkin",
    entityId: attendeeId,
    action: attendee.checkedInAt ? "override" : "checkin",
    summary: `${attendee.email} eingecheckt`,
    payload: input.overrideReason ? { overrideReason: input.overrideReason } : null,
  });

  revalidatePath("/check-in");
  revalidatePath("/admin");
  revalidatePath("/admin/attendees");

  return { ok: true, message: `${attendee.firstName} ${attendee.lastName} wurde erfolgreich eingecheckt.` };
}
