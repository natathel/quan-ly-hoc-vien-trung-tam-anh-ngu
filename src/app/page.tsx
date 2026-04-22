import { DashboardShell } from "@/components/dashboard-shell";
import { getDashboardStats, listCourses, listEnrollments, listStudents } from "@/lib/database";

export default function Home() {
  const stats = getDashboardStats();
  const students = listStudents();
  const courses = listCourses();
  const enrollments = listEnrollments();

  return (
    <DashboardShell
      stats={stats}
      students={students}
      courses={courses}
      enrollments={enrollments}
    />
  );
}
