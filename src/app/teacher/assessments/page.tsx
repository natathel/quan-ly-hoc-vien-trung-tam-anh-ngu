import { TeacherAssessmentsPage } from "@/components/teacher/teacher-assessments-page";
import {
  listAssessmentScores,
  listAssessments,
  listCourses,
  listEnrollments,
  listTeachers,
} from "@/lib/database";

export default function TeacherAssessmentsRoute() {
  return (
    <TeacherAssessmentsPage
      teachers={listTeachers()}
      courses={listCourses()}
      enrollments={listEnrollments()}
      assessments={listAssessments()}
      assessmentScores={listAssessmentScores()}
    />
  );
}
