import type { AdminRole, UserKind } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      kind: UserKind;
      roles: AdminRole[];
      attendeeId: string | null;
      eventId: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    kind?: UserKind;
    roles?: AdminRole[];
    attendeeId?: string | null;
    eventId?: string | null;
  }
}
