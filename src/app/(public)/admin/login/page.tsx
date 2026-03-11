import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; reason?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const params = new URLSearchParams();

  if (resolvedSearchParams.email) {
    params.set("email", resolvedSearchParams.email);
  }

  if (resolvedSearchParams.reason) {
    params.set("reason", resolvedSearchParams.reason);
  }

  redirect(params.size ? `/login?${params.toString()}` : "/login");
}
