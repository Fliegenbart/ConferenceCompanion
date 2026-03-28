import { NextResponse } from "next/server";

import { EmailType } from "@prisma/client";

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

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const emailLog = await prisma.emailLog.findFirst({
    where: {
      recipient: email,
      type: EmailType.MAGIC_LINK,
    },
    orderBy: {
      sentAt: "desc",
    },
  });

  const link = emailLog?.metadata && typeof emailLog.metadata === "object" ? (emailLog.metadata as Record<string, unknown>).e2eVerificationUrl : null;

  if (typeof link !== "string" || !link) {
    return NextResponse.json({ error: "Missing token" }, { status: 404 });
  }

  return NextResponse.json({
    token: new URL(link).searchParams.get("token") ?? "",
  });
}

export async function DELETE(request: Request) {
  if (!isTestEnvironment()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const url = new URL(request.url);
  const email = url.searchParams.get("email")?.toLowerCase().trim();

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  await prisma.emailLog.deleteMany({
    where: {
      recipient: email,
      type: EmailType.MAGIC_LINK,
    },
  });

  return NextResponse.json({ ok: true });
}
