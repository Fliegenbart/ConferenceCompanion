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
      <PageHeader title="Downloads" description="Briefings, Karten und logistische Unterlagen zum Download." />
      <SiteSection title="Verfuegbare Dokumente">
        <div className="space-y-4">
          {attendee.event.downloads.map((asset) => (
            <div key={asset.id} className="flex flex-col gap-4 rounded-[24px] border border-[#d9e1d5] bg-white p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-[#173325]">{asset.title}</p>
                <p className="text-sm text-[#5f7267]">{asset.description}</p>
              </div>
              <Button asChild>
                <Link href={asset.fileUrl}>
                  <Download className="mr-2 size-4" />
                  {asset.fileName}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </SiteSection>
    </div>
  );
}
