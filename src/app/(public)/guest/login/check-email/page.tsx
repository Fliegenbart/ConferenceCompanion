import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CheckEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#dfe8da_0%,#eef2ec_45%,#f6f4ee_100%)] px-4">
      <Card className="max-w-xl space-y-5 p-8 text-center">
        <h1 className="text-4xl text-[#173325]">E-Mail versendet</h1>
        <p className="text-base leading-7 text-[#5c6f64]">
          Wenn Ihre Adresse fuer das Event freigeschaltet ist, erhalten Sie in wenigen Augenblicken einen sicheren Login-Link.
        </p>
        <Button asChild>
          <Link href="/">Zur Startseite</Link>
        </Button>
      </Card>
    </div>
  );
}
