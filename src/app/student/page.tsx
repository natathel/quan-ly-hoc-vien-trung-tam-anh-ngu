import { StudentPortal } from "@/components/student/student-portal";
import {
  getDashboardStats,
  getOperationalSummary,
  listAssessmentScores,
  listAssessments,
  listAttendanceRecords,
  listEnrollments,
  listInvoices,
  listNotifications,
  listSessions,
  listStudents,
} from "@/lib/database";

export const dynamic = "force-dynamic";

export default function StudentPage() {
  return (
    <StudentPortal
      students={listStudents()}
      enrollments={listEnrollments()}
      sessions={listSessions()}
      attendanceRecords={listAttendanceRecords()}
      assessments={listAssessments()}
      assessmentScores={listAssessmentScores()}
      invoices={listInvoices()}
      notifications={listNotifications()}
      stats={getDashboardStats()}
      summary={getOperationalSummary()}
    />
  );
}
