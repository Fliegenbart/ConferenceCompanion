import { Card } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#dfe8da_0%,#eef2ec_45%,#f6f4ee_100%)] px-4 py-10">
      <Card className="mx-auto max-w-4xl space-y-4 p-8">
        <h1 className="text-4xl text-[#173325]">Datenschutzinformation</h1>
        <p className="text-base leading-7 text-[#5d7065]">
          Platzhalterseite fuer die finale, juristisch freigegebene Datenschutzinformation von E.ON. In der Enterprise-Ausbaustufe sollte hier der gepruefte Rechtstext inkl. Verarbeitungszwecken, Aufbewahrungsfristen und Kontaktstellen hinterlegt werden.
        </p>
      </Card>
    </div>
  );
}
