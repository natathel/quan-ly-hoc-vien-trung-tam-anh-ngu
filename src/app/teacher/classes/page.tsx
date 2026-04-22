import { TeacherClassesPage } from "@/components/teacher/teacher-classes-page";
import {
  listAttendanceRecords,
  listCourses,
  listEnrollments,
  listSessions,
  listStudents,
  listTeachers,
} from "@/lib/database";

export default function TeacherClassesRoute() {
  return (
    <TeacherClassesPage
      teachers={listTeachers()}
      courses={listCourses()}
      enrollments={listEnrollments()}
      sessions={listSessions()}
      attendanceRecords={listAttendanceRecords()}
      students={listStudents()}
    />
  );
}
