import { TeacherAttendancePage } from "@/components/teacher/teacher-attendance-page";
import {
  listAttendanceRecords,
  listCourses,
  listEnrollments,
  listSessions,
  listTeachers,
} from "@/lib/database";

export default function TeacherAttendanceRoute() {
  return (
    <TeacherAttendancePage
      teachers={listTeachers()}
      courses={listCourses()}
      enrollments={listEnrollments()}
      sessions={listSessions()}
      attendanceRecords={listAttendanceRecords()}
    />
  );
}
