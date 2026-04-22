import { getDashboardStats, getOperationalSummary } from "@/lib/database";

export const runtime = "nodejs";

export async function GET() {
  return Response.json({ stats: getDashboardStats(), summary: getOperationalSummary() });
}
