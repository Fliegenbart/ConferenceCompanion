"use server";

import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export async function createAuditLog(input: {
  eventId?: string | null;
  actorUserId?: string | null;
  entityType: string;
  entityId?: string | null;
  action: string;
  summary: string;
  payload?: Record<string, unknown> | null;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        eventId: input.eventId ?? null,
        actorUserId: input.actorUserId ?? null,
        entityType: input.entityType,
        entityId: input.entityId ?? null,
        action: input.action,
        summary: input.summary,
        payload: (input.payload ?? undefined) as Prisma.InputJsonValue | undefined,
      },
    });
  } catch (error) {
    console.error("Failed to create audit log", error);
  }
}
