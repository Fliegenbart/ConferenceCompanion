import { PrismaClient } from "@prisma/client";

import { loadTestEnv } from "./env";

loadTestEnv();

const globalForE2E = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForE2E.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForE2E.prisma = prisma;
}
