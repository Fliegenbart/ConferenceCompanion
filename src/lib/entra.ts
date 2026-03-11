import type { AdminRole } from "@prisma/client";

const ADMIN_PROVIDER_ID = "azure-ad";

export function isAdminSsoConfigured() {
  return Boolean(
    process.env.ENTRA_ID_CLIENT_ID &&
      process.env.ENTRA_ID_CLIENT_SECRET &&
      process.env.ENTRA_ID_TENANT_ID,
  );
}

export function getAdminProviderId() {
  return ADMIN_PROVIDER_ID;
}

export function parseAllowedGroupIds() {
  return (process.env.ENTRA_ALLOWED_GROUP_IDS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

export function extractProfileTenantId(profile: Record<string, unknown> | undefined) {
  const tenantId = profile?.tid;
  return typeof tenantId === "string" ? tenantId : null;
}

export function extractProfileObjectId(profile: Record<string, unknown> | undefined) {
  const objectId = profile?.oid ?? profile?.sub;
  return typeof objectId === "string" ? objectId : null;
}

export function extractProfileGroups(profile: Record<string, unknown> | undefined) {
  const groups = profile?.groups;

  if (!Array.isArray(groups)) {
    return [];
  }

  return groups.filter((groupId): groupId is string => typeof groupId === "string");
}

export function isAdminRole(role: AdminRole) {
  return [
    "SUPER_ADMIN",
    "EVENT_ADMIN",
    "CONTENT_EDITOR",
    "CHECKIN_STAFF",
    "READ_ONLY",
  ].includes(role);
}
