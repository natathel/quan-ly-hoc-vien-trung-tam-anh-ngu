import { AdminEnrollmentsPage } from "@/components/admin/admin-enrollments-page";
import { listEnrollments } from "@/lib/database";

export default function EnrollmentsAdminPage() {
  const enrollments = listEnrollments();

  return <AdminEnrollmentsPage enrollments={enrollments} />;
}
