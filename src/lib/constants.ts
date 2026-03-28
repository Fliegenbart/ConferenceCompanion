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

export const CONSENT_VERSION = "2026-04-whitelabel-v1";

export const PRIVACY_CONSENT_LABEL =
  "Ich habe die Datenschutzinformation und die rechtlichen Hinweise gelesen. Ich stimme der Verarbeitung meiner Registrierungs-, Reise- und Organisationsdaten für die Durchführung der Veranstaltung zu.";

export const PHOTO_CONSENT_LABEL =
  "Ich willige ein, dass Foto- und Videoaufnahmen aus dem Veranstaltungsumfeld für interne Nachbereitung und freigegebene Unternehmenskommunikation verwendet werden dürfen.";

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  SUPER_ADMIN: "Hauptadministrator",
  EVENT_ADMIN: "Veranstaltungsadmin",
  CONTENT_EDITOR: "Inhaltsredaktion",
  CHECKIN_STAFF: "Einlass-Team",
  READ_ONLY: "Nur lesen",
};

export const EMAIL_TYPE_LABELS: Record<EmailType, string> = {
  INVITATION: "Einladung",
  REGISTRATION_CONFIRMATION: "Registrierungsbestätigung",
  REGISTRATION_UPDATE: "Registrierungsaktualisierung",
  REMINDER: "Erinnerung",
  ANNOUNCEMENT: "Mitteilung",
  MAGIC_LINK: "Zugangslink",
};

export const attendeeNavigation = [
  { href: "/guest", label: "Startseite", icon: LayoutDashboard },
  { href: "/guest/agenda", label: "Agenda", icon: CalendarRange },
  { href: "/guest/my-agenda", label: "Meine Agenda", icon: ClipboardCheck },
  { href: "/guest/info", label: "Veranstaltungsinfos", icon: MapPinned },
  { href: "/guest/speakers", label: "Referenten", icon: Mic2 },
  { href: "/guest/downloads", label: "Unterlagen", icon: Download },
  { href: "/guest/updates", label: "Mitteilungen", icon: Bell },
  { href: "/guest/feedback", label: "Rückmeldung", icon: MessageSquareMore },
];

export const adminNavigation = [
  { href: "/admin", label: "Übersicht", icon: LayoutDashboard },
  { href: "/admin/attendees", label: "Teilnehmer", icon: Users },
  { href: "/admin/agenda", label: "Agenda", icon: CalendarRange },
  { href: "/admin/content", label: "Inhalte", icon: Mic2 },
  { href: "/admin/messaging", label: "Nachrichten", icon: Bell },
  { href: "/admin/settings", label: "Einstellungen", icon: Settings2 },
  { href: "/admin/audit-log", label: "Audit-Protokoll", icon: ShieldCheck },
];

export const checkInNavigation = [{ href: "/check-in", label: "Einlass", icon: ScanLine }];
