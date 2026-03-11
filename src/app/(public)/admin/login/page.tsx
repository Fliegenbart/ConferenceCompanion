import Link from "next/link";
import { Building2, ShieldCheck } from "lucide-react";

import { AdminLoginButton } from "@/components/forms/admin-login-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAdminProviderId, isAdminSsoConfigured } from "@/lib/entra";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const isConfigured = isAdminSsoConfigured();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#dfe8da_0%,#eef2ec_45%,#f6f4ee_100%)] px-4 py-10">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="space-y-6 bg-[#163224] p-8 text-[#fbf7ef]">
          <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/10">
            <ShieldCheck className="size-6" />
          </div>
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c7d4cd]">Organizer Access</p>
            <h1 className="text-4xl">Admin-Zugang ueber Microsoft Entra ID</h1>
            <p className="leading-7 text-[#d8e3dc]">
              Der Organizer-Zugang ist fuer den Pilotbetrieb auf E.ON-internes Microsoft Entra ID umgestellt. Teilnehmer verwenden weiterhin ihre Einladung und Magic Links.
            </p>
          </div>
        </Card>
        <Card className="space-y-6 p-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-[#173325]">Organizer Sign-in</h2>
            <p className="text-sm leading-6 text-[#5d7065]">
              Zugriff erhalten nur freigeschaltete Admin-Nutzer mit zugeordneter Rolle im Conference Companion.
            </p>
          </div>
          {isConfigured ? (
            <AdminLoginButton providerId={getAdminProviderId()} />
          ) : (
            <div className="rounded-[24px] border border-[#e1c3b8] bg-[#fff4ef] p-5 text-sm leading-6 text-[#7d3a26]">
              Microsoft Entra ID ist in dieser Umgebung noch nicht konfiguriert. Setzen Sie die `ENTRA_ID_*` Variablen aus der `.env.example`, bevor Sie den Organizer-Zugang testen.
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" asChild>
              <Link href="/guest/login">Zum Teilnehmer-Login</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/privacy-policy">Datenschutz</Link>
            </Button>
          </div>
          <div className="rounded-[24px] border border-[#d9e1d5] bg-[#f8faf6] p-5 text-sm leading-6 text-[#40574a]">
            <div className="mb-2 flex items-center gap-2 font-semibold text-[#173325]">
              <Building2 className="size-4" />
              Pilot Access Rules
            </div>
            <p>1. Entra-Anmeldung mit freigeschaltetem Firmenkonto.</p>
            <p>2. Zugeordnete Admin-Rolle im System.</p>
            <p>3. Optionaler Gruppenabgleich ueber `ENTRA_ALLOWED_GROUP_IDS`.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
