import { Activity, CalendarRange, CheckCircle2, Users } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { SiteSection } from "@/components/site-section";
import { StatCard } from "@/components/stat-card";
import { requireAdminSession } from "@/lib/auth";
import { getAdminDashboard } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await requireAdminSession();
  const dashboard = await getAdminDashboard(session.user.eventId!);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Organizer Dashboard"
        title="Veranstaltungsuebersicht"
        description="Live-Metriken, Session-Auslastung und letzte administrative Aktivitaeten."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Invited" value={dashboard.invited} icon={Users} />
        <StatCard label="Registered" value={dashboard.registered} icon={CalendarRange} />
        <StatCard label="Declined" value={dashboard.declined} icon={Activity} />
        <StatCard label="Checked in" value={dashboard.checkedIn} icon={CheckCircle2} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <SiteSection title="Session Capacities">
          <div className="space-y-3">
            {dashboard.sessions.map((sessionItem) => {
              const fill = sessionItem.capacity ? Math.min((sessionItem.selections.length / sessionItem.capacity) * 100, 100) : 0;

              return (
                <div key={sessionItem.id} className="rounded-[24px] border border-[#d9e1d5] bg-white p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[#173325]">{sessionItem.title}</p>
                      <p className="text-sm text-[#5d7065]">{sessionItem.room?.name ?? "Raum folgt"}</p>
                    </div>
                    <p className="text-sm text-[#5d7065]">
                      {sessionItem.capacity ? `${sessionItem.selections.length}/${sessionItem.capacity}` : "ohne Limit"}
                    </p>
                  </div>
                  {sessionItem.capacity ? (
                    <div className="mt-3 h-2 rounded-full bg-[#e8eee3]">
                      <div className="h-2 rounded-full bg-[#da4f29]" style={{ width: `${fill}%` }} />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </SiteSection>
        <SiteSection title="Recent Audit Activity">
          <div className="space-y-3">
            {dashboard.recentLogs.map((log) => (
              <div key={log.id} className="rounded-[24px] border border-[#d9e1d5] bg-white p-4">
                <p className="font-medium text-[#173325]">{log.summary}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#708177]">
                  {log.entityType} · {log.action}
                </p>
              </div>
            ))}
          </div>
        </SiteSection>
      </div>
    </div>
  );
}
