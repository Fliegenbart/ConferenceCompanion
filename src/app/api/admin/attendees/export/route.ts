import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerAuthSession();

  if (!session?.user?.roles?.length || !session.user.eventId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const attendees = await prisma.attendee.findMany({
    where: {
      eventId: session.user.eventId,
    },
    orderBy: { lastName: "asc" },
  });

  const headers = ["first_name", "last_name", "email", "company", "title", "attendance_response", "registration_status", "checked_in"];
  const rows = attendees.map((attendee) =>
    [
      attendee.firstName,
      attendee.lastName,
      attendee.email,
      attendee.company ?? "",
      attendee.title ?? "",
      attendee.attendanceResponse,
      attendee.registrationStatus,
      attendee.checkedInAt ? "yes" : "no",
    ]
      .map((value) => `"${String(value).replaceAll('"', '""')}"`)
      .join(","),
  );

  const csv = [headers.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="attendees-export.csv"',
    },
  });
}
