import { PageHeader } from "@/components/page-header";
import { SiteSection } from "@/components/site-section";
import { requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AuditLogPage() {
  const session = await requireAdminSession();
  const logs = await prisma.auditLog.findMany({
    where: { eventId: session.user.eventId! },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Audit Log" description="Nachvollziehbarkeit aller relevanten Admin-Aenderungen und operativen Aktionen." />
      <SiteSection title="Letzte Eintraege">
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="rounded-[24px] border border-[#d9e1d5] bg-white p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-[#173325]">{log.summary}</p>
                  <p className="text-sm text-[#5d7065]">
                    {log.entityType} · {log.action}
                  </p>
                </div>
                <p className="text-xs uppercase tracking-[0.16em] text-[#708177]">{new Date(log.createdAt).toLocaleString("de-DE")}</p>
              </div>
            </div>
          ))}
        </div>
      </SiteSection>
    </div>
  );
}
