import { AdminTeachersPage } from "@/components/admin/admin-teachers-page";
import { listCourses, listEnrollments, listTeachers } from "@/lib/database";

export default function TeachersAdminPage() {
  const teachers = listTeachers();
  const courses = listCourses();
  const enrollments = listEnrollments();

  return <AdminTeachersPage teachers={teachers} courses={courses} enrollments={enrollments} />;
}
