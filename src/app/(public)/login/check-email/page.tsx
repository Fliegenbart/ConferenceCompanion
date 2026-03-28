import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CheckEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="max-w-xl space-y-5 p-8 text-center">
        <h1 className="font-manrope text-5xl tracking-[-0.06em] text-[#111315]">Link ist unterwegs.</h1>
        <p className="text-base leading-7 text-[#59616a]">
          Wenn Ihre Adresse freigegeben ist, kommt der Link gleich per E-Mail.
        </p>
        <Button asChild>
          <Link href="/">Zur Startseite</Link>
        </Button>
      </Card>
    </div>
  );
}
