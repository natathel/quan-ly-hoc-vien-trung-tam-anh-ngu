import { DashboardShell } from "@/components/dashboard-shell";
import {
  getDashboardStats,
  getOperationalSummary,
  listCourses,
  listEnrollments,
  listStudents,
  listTeachers,
} from "@/lib/database";

export default function AdminPage() {
  const stats = getDashboardStats();
  const summary = getOperationalSummary();
  const students = listStudents();
  const courses = listCourses();
  const enrollments = listEnrollments();
  const teachers = listTeachers();

  return (
    <DashboardShell
      stats={stats}
      summary={summary}
      students={students}
      courses={courses}
      enrollments={enrollments}
      teachers={teachers}
    />
  );
}
