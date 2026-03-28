import Link from "next/link";
import { CheckCircle2, ShieldCheck, UserRoundPlus, Users } from "lucide-react";

import { AdminAttendeeTable } from "@/components/admin-attendee-table";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
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
  const supportFlags = dashboard.attendees.filter((attendee) => attendee.dietaryRequirements || attendee.accessibilityNeeds).length;

  async function inviteAction(formData: FormData) {
    "use server";
    await createAttendeeInviteAction(formData);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Teilnehmer"
        title="Teilnehmer verwalten"
        description="Einladungen senden und Antworten prüfen."
        actions={
          <Button variant="outline" asChild>
            <Link href="/api/admin/attendees/export">Teilnehmer exportieren</Link>
          </Button>
        }
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Gesamt" value={dashboard.attendees.length} icon={Users} hint="eingeladene Personen" />
        <StatCard label="Registriert" value={dashboard.registered} icon={CheckCircle2} hint="zugesagt oder ergänzt" />
        <StatCard label="Vor Ort" value={dashboard.checkedIn} icon={ShieldCheck} hint="schon eingecheckt" />
        <StatCard label="Hinweise" value={supportFlags} icon={UserRoundPlus} hint="Ernährung oder Barrierefreiheit" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <SiteSection title="Einladung anlegen" description="Gast erfassen und Einladung senden.">
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
        <SiteSection title="Wichtig heute" description="Offene Antworten und schnelle Aufgaben.">
          <div className="grid gap-3">
            {[
              { label: "Offene Antworten", value: Math.max(dashboard.invited - dashboard.registered - dashboard.declined, 0), hint: "Noch ohne Antwort" },
              { label: "Abgesagt", value: dashboard.declined, hint: "Antwort aktuell Nein" },
              { label: "Export", value: "CSV", hint: "Liste herunterladen" },
            ].map((item) => (
              <div key={item.label} className="rounded-[18px] border border-[#ddd6cb] bg-[#f7f3ed] px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6a6256]">{item.label}</p>
                <p className="mt-2 font-manrope text-2xl font-semibold tracking-[-0.05em] text-[#111315]">{item.value}</p>
                <p className="mt-1 text-sm text-[#59616a]">{item.hint}</p>
              </div>
            ))}
          </div>
        </SiteSection>
      </div>
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
