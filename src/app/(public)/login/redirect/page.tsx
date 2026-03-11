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
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#dfe8da_0%,#eef2ec_45%,#f6f4ee_100%)] px-4">
      <Card className="max-w-xl space-y-5 p-8">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6b7f73]">Access Pending</p>
          <h1 className="text-3xl text-[#173325]">Kein freigegebener Bereich gefunden</h1>
          <p className="text-base leading-7 text-[#5c6f64]">
            Diese E-Mail-Adresse ist aktuell weder einem Teilnehmerprofil noch einer Organizer-Rolle zugeordnet.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/login">Andere E-Mail-Adresse verwenden</Link>
          </Button>
          <SignOutButton />
        </div>
      </Card>
    </div>
  );
}
