import { Database, ScanLine, ShieldCheck } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
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
  const uniqueEntities = new Set(logs.map((log) => log.entityType)).size;
  const checkInActions = logs.filter((log) => log.entityType === "CHECK_IN" || log.action.toLowerCase().includes("check")).length;

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Sicherheit" title="Änderungen" description="Letzte Änderungen im Blick." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Einträge" value={logs.length} icon={ShieldCheck} hint="letzte 100" />
        <StatCard label="Bereiche" value={uniqueEntities} icon={Database} hint="mit Änderungen" />
        <StatCard label="Einlass" value={checkInActions} icon={ScanLine} hint="am Einlass" />
      </div>
      <SiteSection title="Zuletzt geändert" description="Jüngste Aktionen.">
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="rounded-[20px] border border-[#e2dbd0] bg-white p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium text-[#111315]">{log.summary}</p>
                  <p className="text-sm text-[#5d646b]">
                    {log.entityType} · {log.action}
                  </p>
                </div>
                <p className="text-xs uppercase tracking-[0.16em] text-[#7b8187]">{new Date(log.createdAt).toLocaleString("de-DE")}</p>
              </div>
            </div>
          ))}
        </div>
      </SiteSection>
    </div>
  );
}
