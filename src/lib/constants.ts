import type { AdminRole, EmailType } from "@prisma/client";
import {
  Bell,
  CalendarRange,
  ClipboardCheck,
  Download,
  LayoutDashboard,
  MapPinned,
  MessageSquareMore,
  Mic2,
  ScanLine,
  Settings2,
  ShieldCheck,
  Users,
} from "lucide-react";

export const DEFAULT_EVENT_SLUG = "vertriebskonferenz-2026";

export const CONSENT_VERSION = "2026-04-enterprise-pilot";

export const PRIVACY_CONSENT_LABEL =
  "Ich habe die Datenschutzinformation und die rechtlichen Hinweise gelesen. Ich stimme der Verarbeitung meiner Registrierungs-, Reise- und Organisationsdaten fuer die Durchfuehrung der Veranstaltung zu.";

export const PHOTO_CONSENT_LABEL =
  "Ich willige ein, dass Foto- und Videoaufnahmen aus dem Veranstaltungsumfeld fuer interne Nachbereitung, Pilotdokumentation und freigegebene Unternehmenskommunikation verwendet werden duerfen.";

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  SUPER_ADMIN: "Super Admin",
  EVENT_ADMIN: "Event Admin",
  CONTENT_EDITOR: "Content Editor",
  CHECKIN_STAFF: "Check-in Staff",
  READ_ONLY: "Read Only",
};

export const EMAIL_TYPE_LABELS: Record<EmailType, string> = {
  INVITATION: "Einladung",
  REGISTRATION_CONFIRMATION: "Registrierungsbestaetigung",
  REGISTRATION_UPDATE: "Registrierungsupdate",
  REMINDER: "Erinnerung",
  ANNOUNCEMENT: "Update",
  MAGIC_LINK: "Magic Link",
};

export const attendeeNavigation = [
  { href: "/guest", label: "Home", icon: LayoutDashboard },
  { href: "/guest/agenda", label: "Agenda", icon: CalendarRange },
  { href: "/guest/my-agenda", label: "Meine Agenda", icon: ClipboardCheck },
  { href: "/guest/info", label: "Event Infos", icon: MapPinned },
  { href: "/guest/speakers", label: "Speaker", icon: Mic2 },
  { href: "/guest/downloads", label: "Downloads", icon: Download },
  { href: "/guest/updates", label: "Updates", icon: Bell },
  { href: "/guest/feedback", label: "Feedback", icon: MessageSquareMore },
];

export const adminNavigation = [
  { href: "/admin", label: "Uebersicht", icon: LayoutDashboard },
  { href: "/admin/attendees", label: "Attendees", icon: Users },
  { href: "/admin/agenda", label: "Agenda", icon: CalendarRange },
  { href: "/admin/content", label: "Content", icon: Mic2 },
  { href: "/admin/messaging", label: "Messaging", icon: Bell },
  { href: "/admin/settings", label: "Einstellungen", icon: Settings2 },
  { href: "/admin/audit-log", label: "Audit Log", icon: ShieldCheck },
];

export const checkInNavigation = [{ href: "/check-in", label: "Check-in", icon: ScanLine }];
