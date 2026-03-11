"use client";

import { Html5Qrcode } from "html5-qrcode";
import { Camera, LoaderCircle, ScanLine, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { processCheckInAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";
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

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-[28px] border border-[#d9e1d5] bg-white p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-2xl bg-[#e7eee2] p-2 text-[#395642]">
            <Camera className="size-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#173325]">QR Scan</h2>
            <p className="text-sm text-[#5d7065]">Kamera im Browser fuer schnellen Check-in am Empfang.</p>
          </div>
        </div>
        <div id="qr-reader" className="overflow-hidden rounded-[24px] border border-[#d9e1d5]" />
      </div>
      <div className="space-y-5 rounded-[28px] border border-[#d9e1d5] bg-white p-5">
        <div>
          <h2 className="text-xl font-semibold text-[#173325]">Manueller Check-in</h2>
          <p className="text-sm text-[#5d7065]">Fallback fuer QR-Probleme oder Sonderfaelle vor Ort.</p>
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#809283]" />
          <Input value={manualSearch} onChange={(event) => setManualSearch(event.target.value)} className="pl-10" placeholder="Teilnehmer suchen" />
        </div>
        <div className="max-h-72 space-y-2 overflow-auto">
          {filtered.map((attendee) => (
            <button
              key={attendee.id}
              type="button"
              onClick={() => setSelectedAttendeeId(attendee.id)}
              className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm ${
                selectedAttendeeId === attendee.id ? "border-[#da4f29] bg-[#fff5ef]" : "border-[#d8e0d4] bg-[#f8faf6]"
              }`}
            >
              <span className="text-[#173325]">{attendee.label}</span>
              <span className="text-xs uppercase tracking-[0.16em] text-[#708177]">{attendee.checkedIn ? "Vor Ort" : "Offen"}</span>
            </button>
          ))}
        </div>
        <Input value={overrideReason} onChange={(event) => setOverrideReason(event.target.value)} placeholder="Override-Begruendung (optional)" />
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
          Check-in bestaetigen
        </Button>
      </div>
    </div>
  );
}
