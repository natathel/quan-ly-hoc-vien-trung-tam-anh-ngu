import { TeacherPortal } from "@/components/teacher/teacher-portal";
import {
  getOperationalSummary,
  listAssessments,
  listCourses,
  listEnrollments,
  listSessions,
  listTeachers,
} from "@/lib/database";

export default function TeacherPage() {
  return (
    <TeacherPortal
      teachers={listTeachers()}
      courses={listCourses()}
      enrollments={listEnrollments()}
      sessions={listSessions()}
      assessments={listAssessments()}
      summary={getOperationalSummary()}
    />
  );
}
