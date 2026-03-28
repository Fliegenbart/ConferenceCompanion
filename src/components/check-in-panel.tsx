"use client";

import { Html5Qrcode } from "html5-qrcode";
import { Camera, LoaderCircle, ScanLine, Search, ShieldAlert, UserRoundCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { processCheckInAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function CheckInPanel({
  attendees,
}: {
  attendees: { id: string; label: string; checkedIn: boolean }[];
}) {
  const [manualSearch, setManualSearch] = useState("");
  const [selectedAttendeeId, setSelectedAttendeeId] = useState("");
  const [overrideReason, setOverrideReason] = useState("");
  const [isPending, setIsPending] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        async (decodedText) => {
          setIsPending(true);
          const result = await processCheckInAction({ token: decodedText });
          setIsPending(false);
          if (result.ok) {
            toast.success(result.message);
          } else {
            toast.error(result.message);
          }
        },
        () => undefined,
      )
      .catch((error) => {
        console.error("QR scanner start failed", error);
      });

    return () => {
      void scanner.stop().catch(() => undefined);
    };
  }, []);

  const filtered = attendees.filter((attendee) => attendee.label.toLowerCase().includes(manualSearch.toLowerCase()));
  const selectedAttendee = attendees.find((attendee) => attendee.id === selectedAttendeeId) ?? null;
  const checkedInCount = attendees.filter((attendee) => attendee.checkedIn).length;
  const openCount = attendees.length - checkedInCount;

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr_0.8fr]">
      <Card className="space-y-5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-[14px] border border-[#d5ccbf] bg-[#f7f3ed] p-2 text-[#255447]">
              <Camera className="size-5" />
            </div>
            <div>
              <CardTitle>QR-Scan</CardTitle>
              <CardDescription>QR-Code scannen und einlassen.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div id="qr-reader" className="min-h-[420px] overflow-hidden rounded-[18px] border border-[#d5ccbf] bg-[#f7f3ed]" />
        </CardContent>
      </Card>

      <Card className="space-y-5">
        <CardHeader>
          <CardTitle>Manuelle Suche</CardTitle>
          <CardDescription>Wenn kein Code zur Hand ist.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#7a7f84]" />
            <Input
              value={manualSearch}
              onChange={(event) => setManualSearch(event.target.value)}
              className="pl-10"
              placeholder="Teilnehmer suchen"
            />
          </div>
          <div className="max-h-72 space-y-2 overflow-auto pr-1">
            {filtered.map((attendee) => (
              <button
                key={attendee.id}
                type="button"
                onClick={() => setSelectedAttendeeId(attendee.id)}
                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition-colors ${
                  selectedAttendeeId === attendee.id
                    ? "border-[#17191c] bg-[#ece6de]"
                    : "border-[#d5ccbf] bg-[#f7f3ed] hover:bg-[#ffffff]"
                }`}
              >
                <span className="text-[#111315]">{attendee.label}</span>
                <span className="text-xs uppercase tracking-[0.16em] text-[#7a7f84]">{attendee.checkedIn ? "Vor Ort" : "Offen"}</span>
              </button>
            ))}
          </div>

          <div className="rounded-[18px] border border-[#d5ccbf] bg-[#f7f3ed] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6a6256]">Ausgewählt</p>
            <div className="mt-2 space-y-1">
              <p className="font-manrope text-lg font-semibold tracking-[-0.04em] text-[#111315]">{selectedAttendee?.label ?? "Noch niemand ausgewählt"}</p>
              <p className="text-sm text-[#59616a]">
                {selectedAttendee
                  ? selectedAttendee.checkedIn
                    ? "Schon eingecheckt."
                    : "Kann jetzt eingelassen werden."
                  : "Wählen Sie zuerst eine Person."}
              </p>
            </div>
          </div>

          <Input
            value={overrideReason}
            onChange={(event) => setOverrideReason(event.target.value)}
            placeholder="Begründung für den Sonderfall (optional)"
          />

          <Button
            className="w-full"
            disabled={!selectedAttendeeId || isPending}
            onClick={async () => {
              setIsPending(true);
              const result = await processCheckInAction({ attendeeId: selectedAttendeeId, overrideReason });
              setIsPending(false);
              if (result.ok) {
                toast.success(result.message);
              } else {
                toast.error(result.message);
              }
            }}
          >
            {isPending ? <LoaderCircle className="mr-2 size-4 animate-spin" /> : <ScanLine className="mr-2 size-4" />}
            Jetzt einlassen
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-5">
        <Card className="space-y-4">
          <CardHeader>
            <CardTitle>Status</CardTitle>
            <CardDescription>Stand am Einlass.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Eingecheckt", value: checkedInCount },
              { label: "Offen", value: openCount },
              { label: "Sonderfall", value: 0 },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-[18px] border border-[#d5ccbf] bg-[#f7f3ed] px-4 py-3">
                <span className="text-sm text-[#59616a]">{item.label}</span>
                <span className="font-manrope text-xl font-semibold tracking-[-0.04em] text-[#111315]">{item.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="space-y-4">
          <CardHeader>
            <CardTitle>Hinweis</CardTitle>
            <CardDescription>Duplikate kurz prüfen.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-[18px] border border-[#e3cfc9] bg-[#faf1ee] p-4 text-sm text-[#4f2d26]">
              <div className="flex items-center gap-2 font-medium text-[#4f2d26]">
                <ShieldAlert className="size-4" />
                Duplikate
              </div>
              <p className="mt-2 leading-6">
                Wenn jemand schon eingecheckt ist, prüfen Sie Namen und Uhrzeit vor einer erneuten Freigabe.
              </p>
            </div>
            <div className="mt-3 rounded-[18px] border border-[#d5ccbf] bg-[#f7f3ed] p-4 text-sm text-[#59616a]">
              <div className="flex items-center gap-2 font-medium text-[#255447]">
                <UserRoundCheck className="size-4" />
                Schneller Ablauf
              </div>
              <p className="mt-2 leading-6">Scan, Suche und Freigabe ohne Seitenwechsel.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
