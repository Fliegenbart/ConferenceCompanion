"use client";

import type { InvitationStatus, RegistrationStatus } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, ClockAlert, MailPlus, ScanLine, Send, ShieldCheck } from "lucide-react";
import { startTransition } from "react";
import { toast } from "sonner";

import { resendConfirmationAction, resendInvitationAction, sendReminderAction } from "@/actions/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";

type AttendeeRow = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  invitationStatus: InvitationStatus;
  registrationStatus: RegistrationStatus;
  checkedIn: boolean;
  dietaryFlag: boolean;
  accessibilityFlag: boolean;
};

const invitationStatusLabels: Record<InvitationStatus, string> = {
  DRAFT: "Entwurf",
  SENT: "Gesendet",
  OPENED: "Geöffnet",
  REGISTERED: "Registriert",
  DECLINED: "Abgelehnt",
  EXPIRED: "Abgelaufen",
};

const registrationStatusLabels: Record<RegistrationStatus, string> = {
  PENDING: "Ausstehend",
  COMPLETED: "Abgeschlossen",
  UPDATED: "Aktualisiert",
  DECLINED: "Abgelehnt",
  CANCELLED: "Storniert",
};

export function AdminAttendeeTable({ data }: { data: AttendeeRow[] }) {
  const registeredCount = data.filter((row) => row.registrationStatus === "COMPLETED" || row.registrationStatus === "UPDATED").length;
  const checkedInCount = data.filter((row) => row.checkedIn).length;
  const attentionCount = data.filter((row) => row.dietaryFlag || row.accessibilityFlag).length;

  const columns: ColumnDef<AttendeeRow>[] = [
    {
      accessorKey: "name",
      header: "Teilnehmer",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-[#111315]">{row.original.name}</p>
          <p className="text-xs text-[#7a7f84]">{row.original.email}</p>
        </div>
      ),
    },
    {
      accessorKey: "company",
      header: "Unternehmen",
    },
    {
      accessorKey: "invitationStatus",
      header: "Einladung",
      cell: ({ row }) => <Badge variant="outline">{invitationStatusLabels[row.original.invitationStatus]}</Badge>,
    },
    {
      accessorKey: "registrationStatus",
      header: "Registrierung",
      cell: ({ row }) => (
        <Badge variant={row.original.registrationStatus === "COMPLETED" ? "positive" : "default"}>
          {registrationStatusLabels[row.original.registrationStatus]}
        </Badge>
      ),
    },
    {
      accessorKey: "checkedIn",
      header: "Einlass",
      cell: ({ row }) => <Badge variant={row.original.checkedIn ? "positive" : "outline"}>{row.original.checkedIn ? "Vor Ort" : "Offen"}</Badge>,
    },
    {
      id: "flags",
      header: "Merkmale",
      cell: ({ row }) => (
        <div className="flex gap-2">
          {row.original.dietaryFlag ? <Badge variant="accent">Ernährung</Badge> : null}
          {row.original.accessibilityFlag ? <Badge variant="accent">Barrierefreiheit</Badge> : null}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Aktionen",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              startTransition(async () => {
                const result = await resendInvitationAction(row.original.id);
                if (result.ok) {
                  toast.success(result.message);
                } else {
                  toast.error(result.message);
                }
              })
            }
          >
            <MailPlus className="mr-2 size-4" />
            Einladung
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              startTransition(async () => {
                const result = await resendConfirmationAction(row.original.id);
                if (result.ok) {
                  toast.success(result.message);
                } else {
                  toast.error(result.message);
                }
              })
            }
          >
            <Send className="mr-2 size-4" />
            Bestätigung
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              startTransition(async () => {
                const result = await sendReminderAction(row.original.id);
                if (result.ok) {
                  toast.success(result.message);
                } else {
                  toast.error(result.message);
                }
              })
            }
          >
            <ClockAlert className="mr-2 size-4" />
            Erinnerung
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 rounded-[22px] border border-[#ddd6cb] bg-white p-5 shadow-[0_24px_46px_-34px_rgba(17,19,21,0.24)] md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <h2 className="font-manrope text-2xl font-semibold tracking-[-0.04em] text-[#111315]">Teilnehmer</h2>
          <p className="text-sm text-[#59616a]">Suchen, filtern und Nachrichten senden.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d5ccbf] bg-[#f7f3ed] px-4 py-2 text-sm text-[#255447]">
            <CheckCircle2 className="size-4" />
            {registeredCount} registriert
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d5ccbf] bg-[#f7f3ed] px-4 py-2 text-sm text-[#255447]">
            <ScanLine className="size-4" />
            {checkedInCount} vor Ort
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d5ccbf] bg-[#f7f3ed] px-4 py-2 text-sm text-[#255447]">
            <ShieldCheck className="size-4" />
            {attentionCount} mit Hinweisen
          </div>
        </div>
      </div>
      <DataTable columns={columns} data={data} filterPlaceholder="Name, E-Mail oder Unternehmen durchsuchen" />
    </div>
  );
}
