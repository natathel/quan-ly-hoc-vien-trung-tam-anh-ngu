import { AdminRequestsPage } from "@/components/admin/admin-requests-page";
import { listStudentRequests } from "@/lib/database";

export const dynamic = "force-dynamic";;

export default function RequestsAdminPage() {
  const requests = listStudentRequests();

  return <AdminRequestsPage requests={requests} />;
}
