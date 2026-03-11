import { AppShell } from "@/components/app-shell";
import { AttendeeNavigation } from "@/components/attendee-navigation";
import { requireAttendeeSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function GuestLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAttendeeSession();

  return (
    <AppShell
      session={session}
      navigation={<AttendeeNavigation session={session} />}
      mobileNavigation={<AttendeeNavigation session={session} mobile />}
    >
      {children}
    </AppShell>
  );
}
