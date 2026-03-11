"use client";

import type { InvitationStatus, RegistrationStatus } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { ClockAlert, MailPlus, Send, ShieldCheck } from "lucide-react";
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

export function AdminAttendeeTable({ data }: { data: AttendeeRow[] }) {
  const columns: ColumnDef<AttendeeRow>[] = [
    {
      accessorKey: "name",
      header: "Teilnehmer",
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-[#173325]">{row.original.name}</p>
          <p className="text-xs text-[#6a7b71]">{row.original.email}</p>
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
      cell: ({ row }) => <Badge variant="outline">{row.original.invitationStatus}</Badge>,
    },
    {
      accessorKey: "registrationStatus",
      header: "Registrierung",
      cell: ({ row }) => (
        <Badge variant={row.original.registrationStatus === "COMPLETED" ? "positive" : "default"}>
          {row.original.registrationStatus}
        </Badge>
      ),
    },
    {
      accessorKey: "checkedIn",
      header: "Check-in",
      cell: ({ row }) => (
        <Badge variant={row.original.checkedIn ? "positive" : "outline"}>{row.original.checkedIn ? "Vor Ort" : "Offen"}</Badge>
      ),
    },
    {
      id: "flags",
      header: "Flags",
      cell: ({ row }) => (
        <div className="flex gap-2">
          {row.original.dietaryFlag ? <Badge variant="accent">Dietary</Badge> : null}
          {row.original.accessibilityFlag ? <Badge variant="accent">Access</Badge> : null}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Aktionen",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          <Button
            variant="ghost"
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
            variant="ghost"
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
            Bestaetigung
          </Button>
          <Button
            variant="ghost"
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
            Reminder
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#173325]">Attendee Management</h2>
          <p className="text-sm text-[#5d7065]">Suche, Statuspruefung und direkte Kommunikationsaktionen.</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-[#eef3eb] px-4 py-2 text-sm text-[#395642]">
          <ShieldCheck className="size-4" />
          Serverseitig rollenbasiert geschuetzt
        </div>
      </div>
      <DataTable columns={columns} data={data} filterPlaceholder="Name, E-Mail oder Unternehmen durchsuchen" />
    </div>
  );
}
