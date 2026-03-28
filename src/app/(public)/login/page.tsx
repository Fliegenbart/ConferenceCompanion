import { MailCheck } from "lucide-react";
import { redirect } from "next/navigation";

import { BrandMark } from "@/components/brand-mark";
import { GuestLoginForm } from "@/components/forms/guest-login-form";
import { Card } from "@/components/ui/card";
import { getServerAuthSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const reasonMessages: Record<string, string> = {
  admin: "Für diese E-Mail-Adresse ist kein Organisatorenzugang freigegeben.",
  attendee: "Für diese E-Mail-Adresse gibt es kein Teilnehmerprofil.",
  forbidden: "Für diesen Bereich fehlt die passende Freigabe.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; reason?: string }>;
}) {
  const session = await getServerAuthSession();

  if (session?.user?.roles?.length) {
    redirect("/admin");
  }

  if (session?.user?.attendeeId) {
    redirect("/guest");
  }

  const resolvedSearchParams = await searchParams;
  const reasonMessage = resolvedSearchParams.reason ? reasonMessages[resolvedSearchParams.reason] : null;

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <Card className="relative overflow-hidden border-[#1b1d20] bg-[#17191c] p-0 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08)_0%,transparent_34%),linear-gradient(180deg,#1a1c20_0%,#111315_100%)]" />
          <div className="relative flex min-h-[560px] flex-col justify-between p-8 md:p-10 text-white">
            <div className="space-y-7">
              <BrandMark tone="inverse" />
              <div className="inline-flex size-14 items-center justify-center rounded-[18px] border border-white/10 bg-white/5 text-white">
                <MailCheck className="size-6" />
              </div>
              <div className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d8d2ca]">Anmeldung</p>
                <h1 className="max-w-[8ch] text-5xl leading-[0.92] tracking-[-0.08em] md:text-6xl">Zum Event anmelden.</h1>
                <p className="max-w-md text-base leading-7 text-[#c9c4bd]">
                  E-Mail eingeben, Link öffnen, direkt weiter.
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                "Einladung",
                "Teilnehmerbereich",
                "Organisationsteam",
              ].map((item) => (
                <div key={item} className="rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#c9c4bd]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card className="space-y-7 p-8 md:p-9">
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6a6256]">E-Mail eingeben</p>
            <h2 className="font-manrope text-3xl font-semibold tracking-[-0.05em] text-[#111315]">Anmeldelink anfordern</h2>
            <p className="text-sm leading-6 text-[#59616a]">
              Wir senden den Link an diese Adresse.
            </p>
          </div>
          {reasonMessage ? (
            <div className="rounded-[18px] border border-[#e3cfc9] bg-[#faf1ee] p-5 text-sm leading-6 text-[#4f2d26]">{reasonMessage}</div>
          ) : null}
          <GuestLoginForm defaultEmail={resolvedSearchParams.email} />
          <div className="rounded-[18px] border border-[#d5ccbf] bg-[#f7f3ed] p-5 text-sm leading-6 text-[#59616a]">
            Zugang nur mit Einladung oder Freigabe.
          </div>
        </Card>
      </div>
    </div>
  );
}
