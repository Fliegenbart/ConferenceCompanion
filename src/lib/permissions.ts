import type { AdminRole } from "@prisma/client";
import type { Session } from "next-auth";
import { redirect } from "next/navigation";

const roleOrder: Record<AdminRole, number> = {
  READ_ONLY: 0,
  CHECKIN_STAFF: 1,
  CONTENT_EDITOR: 2,
  EVENT_ADMIN: 3,
  SUPER_ADMIN: 4,
};

export function hasAnyRole(session: Session | null, roles: AdminRole[]) {
  if (!session?.user?.roles?.length) {
    return false;
  }

  return roles.some((role) => session.user.roles.includes(role));
}

export function hasMinimumRole(session: Session | null, role: AdminRole) {
  if (!session?.user?.roles?.length) {
    return false;
  }

  return session.user.roles.some((currentRole) => roleOrder[currentRole] >= roleOrder[role]);
}

export function requireRole(session: Session | null, role: AdminRole) {
  if (!hasMinimumRole(session, role)) {
    redirect("/login?reason=forbidden");
  }
}

export function requireMinimumRole(session: Session | null, role: AdminRole) {
  if (!hasMinimumRole(session, role)) {
    redirect("/login?reason=forbidden");
  }

  return session;
}
