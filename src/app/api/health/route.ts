import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { reportPilotError } from "@/lib/observability";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: "ok",
      app: "up",
      database: "up",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    await reportPilotError("healthcheck.database_unavailable", error, {
      route: "/api/health",
    });

    return NextResponse.json(
      {
        status: "degraded",
        app: "up",
        database: "down",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
