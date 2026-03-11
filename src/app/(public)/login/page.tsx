import { MailCheck } from "lucide-react";

import { GuestLoginForm } from "@/components/forms/guest-login-form";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

const reasonMessages: Record<string, string> = {
  admin: "Diese E-Mail-Adresse hat keinen freigegebenen Organizer-Zugang.",
  attendee: "Diese E-Mail-Adresse ist keinem Teilnehmerprofil zugeordnet.",
  forbidden: "Fuer diesen Bereich fehlt die passende Freigabe.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; reason?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const reasonMessage = resolvedSearchParams.reason ? reasonMessages[resolvedSearchParams.reason] : null;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#dfe8da_0%,#eef2ec_45%,#f6f4ee_100%)] px-4 py-10">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="space-y-6 bg-[#163224] p-8 text-[#fbf7ef]">
          <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/10">
            <MailCheck className="size-6" />
          </div>
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c7d4cd]">Secure Access</p>
            <h1 className="text-4xl">Magic-Link-Login fuer Teilnehmer und Organizer</h1>
            <p className="leading-7 text-[#d8e3dc]">
              Verwenden Sie Ihre freigeschaltete E-Mail-Adresse, um einen sicheren Login-Link zu erhalten. Ohne Einladung oder Admin-Freigabe ist kein Zugriff moeglich.
            </p>
          </div>
        </Card>
        <Card className="space-y-6 p-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-[#173325]">Anmelden</h2>
            <p className="text-sm leading-6 text-[#5d7065]">
              Der Link wird per E-Mail versendet. In lokalen Entwicklungsumgebungen ohne Resend erscheint er im Server-Log.
            </p>
          </div>
          {reasonMessage ? (
            <div className="rounded-[24px] border border-[#e1c3b8] bg-[#fff4ef] p-5 text-sm leading-6 text-[#7d3a26]">{reasonMessage}</div>
          ) : null}
          <GuestLoginForm defaultEmail={resolvedSearchParams.email} />
        </Card>
      </div>
    </div>
  );
}
