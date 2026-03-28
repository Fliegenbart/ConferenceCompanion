import Link from "next/link";
import { redirect } from "next/navigation";

import { SignOutButton } from "@/components/sign-out-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getServerAuthSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginRedirectPage() {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.roles.length) {
    redirect("/admin");
  }

  if (session.user.attendeeId) {
    redirect("/guest");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="max-w-xl space-y-5 p-8">
        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6a6256]">Zugriff ausstehend</p>
          <h1 className="font-manrope text-4xl tracking-[-0.05em] text-[#111315]">Kein Bereich gefunden.</h1>
          <p className="text-base leading-7 text-[#59616a]">
            Für diese E-Mail-Adresse gibt es aktuell keinen freigegebenen Bereich.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/login">Andere Adresse nutzen</Link>
          </Button>
          <SignOutButton />
        </div>
      </Card>
    </div>
  );
}
