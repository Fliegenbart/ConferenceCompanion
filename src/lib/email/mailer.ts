import { render } from "@react-email/render";
import { EmailType, Prisma } from "@prisma/client";
import type { ReactElement } from "react";
import { Resend } from "resend";

import { reportPilotError } from "@/lib/observability";
import { prisma } from "@/lib/prisma";

type SendMailInput = {
  attendeeId?: string | null;
  eventId?: string | null;
  to: string;
  subject: string;
  type: EmailType;
  react: ReactElement;
  metadata?: Record<string, unknown>;
};

export async function sendTransactionalEmail(input: SendMailInput) {
  const from = process.env.EMAIL_FROM ?? "ConferenceCompanion <no-reply@example.com>";
  const html = await render(input.react);
  const resendApiKey = process.env.RESEND_API_KEY;

  try {
    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      const result = await resend.emails.send({
        from,
        to: input.to,
        subject: input.subject,
        html,
      });

      await prisma.emailLog.create({
        data: {
          attendeeId: input.attendeeId ?? null,
          eventId: input.eventId ?? null,
          recipient: input.to,
          subject: input.subject,
          type: input.type,
          status: "sent",
          providerMessageId: result.data?.id,
          metadata: input.metadata as Prisma.InputJsonValue | undefined,
        },
      });

      return result;
    }

    console.info("EMAIL_SIMULATION", {
      to: input.to,
      subject: input.subject,
      html,
      metadata: input.metadata,
    });

    await prisma.emailLog.create({
      data: {
        attendeeId: input.attendeeId ?? null,
        eventId: input.eventId ?? null,
        recipient: input.to,
        subject: input.subject,
        type: input.type,
        status: "simulated",
        metadata: input.metadata as Prisma.InputJsonValue | undefined,
      },
    });

    return { data: { id: "simulated" } };
  } catch (error) {
    console.error("Failed to send transactional email", error);
    await reportPilotError("email.send.failed", error, {
      recipient: input.to,
      subject: input.subject,
      emailType: input.type,
    });

    await prisma.emailLog.create({
      data: {
        attendeeId: input.attendeeId ?? null,
        eventId: input.eventId ?? null,
        recipient: input.to,
        subject: input.subject,
        type: input.type,
        status: "failed",
        metadata: {
          ...(input.metadata ?? {}),
          error: error instanceof Error ? error.message : "Unknown error",
        } as Prisma.InputJsonValue,
      },
    });

    throw error;
  }
}
