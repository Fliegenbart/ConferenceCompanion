import { AdminNavigation } from "@/components/admin-navigation";
import { AppShell } from "@/components/app-shell";
import { requireAdminSession } from "@/lib/auth";
import { isAdminSsoConfigured } from "@/lib/entra";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isAdminSsoConfigured()) {
    redirect("/admin/login");
  }

  const session = await requireAdminSession();

  return (
    <AppShell session={session} navigation={<AdminNavigation session={session} />} variant="admin">
      {children}
    </AppShell>
  );
}
