import { Card } from "@/components/ui/card";

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#dfe8da_0%,#eef2ec_45%,#f6f4ee_100%)] px-4 py-10">
      <Card className="mx-auto max-w-4xl space-y-4 p-8">
        <h1 className="text-4xl text-[#173325]">Rechtliche Hinweise</h1>
        <p className="text-base leading-7 text-[#5d7065]">
          Platzhalterseite fuer Impressum, rechtliche Hinweise, Vendor Disclosure und weitere unternehmensspezifische Informationen fuer den produktiven Rollout.
        </p>
      </Card>
    </div>
  );
}
