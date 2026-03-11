import crypto from "node:crypto";

import { SignJWT, jwtVerify } from "jose";

export function generateInvitationToken() {
  return crypto.randomBytes(24).toString("base64url");
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function getJwtSecret() {
  const secret = process.env.APP_SECRET ?? process.env.NEXTAUTH_SECRET;

  if (!secret) {
    throw new Error("APP_SECRET oder NEXTAUTH_SECRET ist erforderlich.");
  }

  return new TextEncoder().encode(secret);
}

export async function createCheckInToken(payload: {
  attendeeId: string;
  eventId: string;
  email: string;
}) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getJwtSecret());
}

export async function verifyCheckInToken(token: string) {
  const result = await jwtVerify(token, getJwtSecret());
  return result.payload as {
    attendeeId: string;
    eventId: string;
    email: string;
  };
}
