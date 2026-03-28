import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { AttendanceResponse, InvitationStatus, RegistrationStatus } from "@prisma/client";

import { DEFAULT_EVENT_SLUG } from "@/lib/constants";
import { getCurrentEventOrThrow } from "@/lib/data";
import { generateInvitationToken, hashToken } from "@/lib/tokens";
import { prisma } from "@/lib/prisma";

function isTestEnvironment() {
  return process.env.E2E_TESTING === "1";
}

export async function POST(request: Request) {
  if (!isTestEnvironment()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = (await request.json().catch(() => null)) as
    | {
        firstName?: string;
        lastName?: string;
        emailPrefix?: string;
      }
    | null;

  const event = await getCurrentEventOrThrow(DEFAULT_EVENT_SLUG);
  const email = `${body?.emailPrefix ?? "e2e"}.${Date.now()}.${crypto.randomBytes(4).toString("hex")}@partner.example`;
  const rawToken = generateInvitationToken();

  const attendee = await prisma.attendee.create({
    data: {
      eventId: event.id,
      firstName: body?.firstName ?? "Test",
      lastName: body?.lastName ?? "Guest",
      email,
      company: "Partnernetzwerk Nord",
      title: "Account Manager",
      invitationStatus: InvitationStatus.SENT,
      registrationStatus: RegistrationStatus.PENDING,
      attendanceResponse: AttendanceResponse.UNDECIDED,
      invitedAt: new Date(),
    },
  });

  await prisma.invitation.create({
    data: {
      attendeeId: attendee.id,
      status: InvitationStatus.SENT,
      tokenHash: hashToken(rawToken),
      tokenLastFour: rawToken.slice(-4),
      sentAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return NextResponse.json({
    attendee: {
      id: attendee.id,
      email: attendee.email,
      firstName: attendee.firstName,
      lastName: attendee.lastName,
    },
    rawToken,
    eventId: event.id,
  });
}
