import { StudentSchedulePage } from "@/components/student/student-schedule-page";
import { listAttendanceRecords, listEnrollments, listSessions, listStudents } from "@/lib/database";

export default function StudentScheduleRoute() {
  return (
    <StudentSchedulePage
      students={listStudents()}
      enrollments={listEnrollments()}
      sessions={listSessions()}
      attendanceRecords={listAttendanceRecords()}
    />
  );
}
