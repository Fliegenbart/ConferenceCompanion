import Link from "next/link";

import { AdminAttendeeTable } from "@/components/admin-attendee-table";
import { PageHeader } from "@/components/page-header";
import { SubmitButton } from "@/components/submit-button";
import { SiteSection } from "@/components/site-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAttendeeInviteAction } from "@/actions/admin";
import { requireAdminSession } from "@/lib/auth";
import { getAdminDashboard } from "@/lib/data";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminAttendeesPage() {
  const session = await requireAdminSession();
  const dashboard = await getAdminDashboard(session.user.eventId!);

  async function inviteAction(formData: FormData) {
    "use server";
    await createAttendeeInviteAction(formData);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendees"
        description="Einladungen verwalten, Registrierungsstatus verfolgen und CSV-Exporte erzeugen."
        actions={
          <Button variant="outline" asChild>
            <Link href="/api/admin/attendees/export">CSV Export</Link>
          </Button>
        }
      />
      <SiteSection title="Neue Einladung anlegen" description="Manuelle Anlage eines eingeladenen Gastes inklusive direktem Versand des Registrierungslinks.">
        <form action={inviteAction} className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="space-y-2">
            <Label htmlFor="firstName">Vorname</Label>
            <Input id="firstName" name="firstName" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Nachname</Label>
            <Input id="lastName" name="lastName" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-Mail</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Unternehmen</Label>
            <Input id="company" name="company" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Rolle / Titel</Label>
            <Input id="title" name="title" />
          </div>
          <div className="md:col-span-2 xl:col-span-5">
            <SubmitButton>Einladung erstellen und senden</SubmitButton>
          </div>
        </form>
      </SiteSection>
      <AdminAttendeeTable
        data={dashboard.attendees.map((attendee) => ({
          id: attendee.id,
          name: `${attendee.firstName} ${attendee.lastName}`,
          email: attendee.email,
          company: attendee.company,
          invitationStatus: attendee.invitationStatus,
          registrationStatus: attendee.registrationStatus,
          checkedIn: Boolean(attendee.checkedInAt),
          dietaryFlag: Boolean(attendee.dietaryRequirements),
          accessibilityFlag: Boolean(attendee.accessibilityNeeds),
        }))}
      />
    </div>
  );
}
