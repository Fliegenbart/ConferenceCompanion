import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  rateLimitEntry: {
    findUnique: vi.fn(),
    create: vi.fn(),
    updateMany: vi.fn(),
  },
  $transaction: vi.fn(),
}));

prismaMock.$transaction.mockImplementation(async (callback: (tx: typeof prismaMock) => Promise<unknown>) => callback(prismaMock));

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));

import { assertRateLimit, __getRateLimitErrorMessage } from "@/lib/rate-limit";

describe("rate limiting", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    prismaMock.$transaction.mockImplementation(async (callback: (tx: typeof prismaMock) => Promise<unknown>) => callback(prismaMock));
  });

  it("creates a new persistent bucket for a fresh key", async () => {
    prismaMock.rateLimitEntry.findUnique.mockResolvedValueOnce(null);
    prismaMock.rateLimitEntry.create.mockResolvedValueOnce({ key: "login:1", count: 1 });

    await expect(assertRateLimit("login:1", 3, 60_000)).resolves.toBeUndefined();

    expect(prismaMock.rateLimitEntry.create).toHaveBeenCalledWith({
      data: {
        key: "login:1",
        count: 1,
        resetAt: expect.any(Date),
      },
    });
  });

  it("increments an existing bucket until the limit is reached", async () => {
    prismaMock.rateLimitEntry.findUnique.mockResolvedValueOnce({
      key: "login:2",
      count: 1,
      resetAt: new Date(Date.now() + 60_000),
    });
    prismaMock.rateLimitEntry.updateMany.mockResolvedValueOnce({ count: 1 });

    await expect(assertRateLimit("login:2", 3, 60_000)).resolves.toBeUndefined();

    expect(prismaMock.rateLimitEntry.updateMany).toHaveBeenCalledWith({
      where: {
        key: "login:2",
        resetAt: { gt: expect.any(Date) },
        count: { lt: 3 },
      },
      data: {
        count: { increment: 1 },
      },
    });
  });

  it("rejects requests once the limit is exhausted", async () => {
    prismaMock.rateLimitEntry.findUnique.mockResolvedValueOnce({
      key: "login:3",
      count: 3,
      resetAt: new Date(Date.now() + 60_000),
    });

    await expect(assertRateLimit("login:3", 3, 60_000)).rejects.toThrow(__getRateLimitErrorMessage());
    expect(prismaMock.rateLimitEntry.updateMany).not.toHaveBeenCalled();
  });

  it("resets an expired bucket in the database", async () => {
    prismaMock.rateLimitEntry.findUnique.mockResolvedValueOnce({
      key: "login:4",
      count: 7,
      resetAt: new Date(Date.now() - 60_000),
    });
    prismaMock.rateLimitEntry.updateMany.mockResolvedValueOnce({ count: 1 });

    await expect(assertRateLimit("login:4", 3, 120_000)).resolves.toBeUndefined();

    expect(prismaMock.rateLimitEntry.updateMany).toHaveBeenCalledWith({
      where: {
        key: "login:4",
        resetAt: { lte: expect.any(Date) },
      },
      data: {
        count: 1,
        resetAt: expect.any(Date),
      },
    });
  });
});
