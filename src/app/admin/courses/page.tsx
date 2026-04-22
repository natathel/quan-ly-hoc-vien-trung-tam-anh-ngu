import { AdminCoursesPage } from "@/components/admin/admin-courses-page";
import { listCourses, listEnrollments, listSessions } from "@/lib/database";

export default function CoursesAdminPage() {
  const courses = listCourses();
  const enrollments = listEnrollments();
  const sessions = listSessions();

  return <AdminCoursesPage courses={courses} enrollments={enrollments} sessions={sessions} />;
}
