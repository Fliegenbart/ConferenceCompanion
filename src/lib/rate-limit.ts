import { prisma } from "@/lib/prisma";

const rateLimitMessage = "Zu viele Anfragen. Bitte versuchen Sie es später erneut.";

function isUniqueConstraintError(error: unknown) {
  return Boolean(error && typeof error === "object" && "code" in error && (error as { code?: string }).code === "P2002");
}

export async function assertRateLimit(key: string, limit: number, windowMs: number) {
  const now = new Date();
  const resetAt = new Date(now.getTime() + windowMs);

  await prisma.$transaction(async (tx) => {
    let current = await tx.rateLimitEntry.findUnique({
      where: { key },
    });

    if (!current) {
      try {
        await tx.rateLimitEntry.create({
          data: {
            key,
            count: 1,
            resetAt,
          },
        });
        return;
      } catch (error) {
        if (!isUniqueConstraintError(error)) {
          throw error;
        }

        current = await tx.rateLimitEntry.findUnique({
          where: { key },
        });
      }
    }

    if (!current) {
      throw new Error(rateLimitMessage);
    }

    if (current.resetAt <= now) {
      const updated = await tx.rateLimitEntry.updateMany({
        where: {
          key,
          resetAt: {
            lte: now,
          },
        },
        data: {
          count: 1,
          resetAt,
        },
      });

      if (!updated.count) {
        throw new Error(rateLimitMessage);
      }

      return;
    }

    if (current.count >= limit) {
      throw new Error(rateLimitMessage);
    }

    const updated = await tx.rateLimitEntry.updateMany({
      where: {
        key,
        resetAt: {
          gt: now,
        },
        count: {
          lt: limit,
        },
      },
      data: {
        count: {
          increment: 1,
        },
      },
    });

    if (!updated.count) {
      throw new Error(rateLimitMessage);
    }
  });
}

export function __getRateLimitErrorMessage() {
  return rateLimitMessage;
}
