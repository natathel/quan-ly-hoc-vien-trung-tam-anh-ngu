import { StudentPortal } from "@/components/student/student-portal";
import {
  getDashboardStats,
  getOperationalSummary,
  listAssessmentScores,
  listAssessments,
  listAttendanceRecords,
  listEnrollments,
  listInvoices,
  listSessions,
  listStudents,
} from "@/lib/database";

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
      stats={getDashboardStats()}
      summary={getOperationalSummary()}
    />
  );
}
