import { StudentRequestsPage } from "@/components/student/student-requests-page";
import { listNotifications, listStudentRequests, listStudents } from "@/lib/database";

export const dynamic = "force-dynamic";;

export default function RequestsStudentPage() {
  const students = listStudents();
  const requests = listStudentRequests();
  const notifications = listNotifications();

  return <StudentRequestsPage students={students} requests={requests} notifications={notifications} />;
}
