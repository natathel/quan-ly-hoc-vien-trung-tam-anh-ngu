import { AdminLeadsPage } from "@/components/admin/admin-leads-page";
import { listLeads } from "@/lib/database";

export default function LeadsAdminPage() {
  const leads = listLeads();

  return <AdminLeadsPage leads={leads} />;
}
