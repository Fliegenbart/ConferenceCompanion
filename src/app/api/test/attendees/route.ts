import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

function isTestEnvironment() {
  return process.env.E2E_TESTING === "1";
}

export async function GET(request: Request) {
  if (!isTestEnvironment()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const url = new URL(request.url);
  const email = url.searchParams.get("email")?.toLowerCase().trim();
  const id = url.searchParams.get("id")?.trim();

  if (!email && !id) {
    return NextResponse.json({ error: "Missing email or id" }, { status: 400 });
  }

  const attendee = await prisma.attendee.findFirst({
    where: email ? { email } : { id: id ?? undefined },
    include: {
      registration: true,
      sessionSelections: true,
      invitation: true,
      checkIns: true,
    },
  });

  if (!attendee) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    attendee: {
      id: attendee.id,
      email: attendee.email,
      firstName: attendee.firstName,
      lastName: attendee.lastName,
      registrationStatus: attendee.registrationStatus,
      attendanceResponse: attendee.attendanceResponse,
      checkedInAt: attendee.checkedInAt,
      invitationStatus: attendee.invitationStatus,
      sessionSelectionCount: attendee.sessionSelections.length,
      registrationId: attendee.registration?.id ?? null,
      invitationId: attendee.invitation?.id ?? null,
    },
  });
}
