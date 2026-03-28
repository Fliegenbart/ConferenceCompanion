import Link from "next/link";
import { Download } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { SiteSection } from "@/components/site-section";
import { Button } from "@/components/ui/button";
import { requireAttendeeSession } from "@/lib/auth";
import { getAttendeePortal } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function DownloadsPage() {
  const session = await requireAttendeeSession();
  const attendee = await getAttendeePortal(session.user.attendeeId!);

  if (!attendee) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Infos" title="Unterlagen" description="Pläne, Briefings und PDFs." />
      <SiteSection title="Downloads" description="Datei öffnen oder speichern.">
        <div className="space-y-4">
          {attendee.event.downloads.map((asset) => (
            <div key={asset.id} className="flex flex-col gap-4 rounded-[20px] border border-[#e2dbd0] bg-white p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-medium text-[#111315]">{asset.title}</p>
                <p className="text-sm text-[#5d646b]">{asset.description}</p>
              </div>
              <Button asChild>
                <Link href={asset.fileUrl}>
                  <Download className="mr-2 size-4" />
                  Herunterladen
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </SiteSection>
    </div>
  );
}
