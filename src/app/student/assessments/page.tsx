import { StudentAssessmentsPage } from "@/components/student/student-assessments-page";
import { listAssessmentScores, listAssessments, listEnrollments, listStudents } from "@/lib/database";

export default function StudentAssessmentsRoute() {
  return (
    <StudentAssessmentsPage
      students={listStudents()}
      enrollments={listEnrollments()}
      assessments={listAssessments()}
      assessmentScores={listAssessmentScores()}
    />
  );
}
