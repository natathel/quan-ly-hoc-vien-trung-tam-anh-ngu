import { AdminStudentsPage } from "@/components/admin/admin-students-page";
import { listEnrollments, listStudents } from "@/lib/database";

export default function StudentsAdminPage() {
  const students = listStudents();
  const enrollments = listEnrollments();

  return <AdminStudentsPage students={students} enrollments={enrollments} />;
}
