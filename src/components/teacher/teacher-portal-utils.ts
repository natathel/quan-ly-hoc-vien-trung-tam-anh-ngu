import type {
  Assessment,
  AssessmentScore,
  AttendanceRecord,
  Course,
  Enrollment,
  Session,
  Student,
  Teacher,
} from "@/lib/types";

export const teacherStatusLabel: Record<Teacher["status"], string> = {
  active: "Đang giảng dạy",
  on_leave: "Nghỉ phép",
  inactive: "Ngưng hợp tác",
};

export const sessionStatusLabel: Record<Session["status"], string> = {
  scheduled: "Sắp diễn ra",
  completed: "Đã hoàn thành",
  cancelled: "Đã hủy",
};

export const attendanceLabel: Record<AttendanceRecord["status"], string> = {
  present: "Có mặt",
  absent: "Vắng",
  late: "Đi trễ",
  excused: "Có phép",
};

export const assessmentTypeLabel: Record<Assessment["assessmentType"], string> = {
  placement: "Đầu vào",
  quiz: "Bài kiểm tra ngắn",
  midterm: "Giữa kỳ",
  final: "Cuối kỳ",
  speaking: "Nói",
  writing: "Viết",
};

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatScore(value?: number) {
  if (value === undefined || Number.isNaN(value)) return "-";
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}

export function formatPercent(value?: number) {
  if (value === undefined || Number.isNaN(value)) return "-";
  return `${Math.round(value)}%`;
}

export function getCurrentTeacherContext({
  teachers,
  courses,
}: {
  teachers: Teacher[];
  courses: Course[];
}) {
  const teacher = teachers.find((item) => item.status === "active") ?? teachers[0];
  const assignedCourses = teacher ? courses.filter((course) => course.teacher === teacher.fullName) : [];
  const assignedCourseIds = new Set(assignedCourses.map((course) => course.id));

  return { teacher, assignedCourses, assignedCourseIds };
}

export function getTeacherEnrollments({
  enrollments,
  assignedCourseIds,
}: {
  enrollments: Enrollment[];
  assignedCourseIds: Set<number>;
}) {
  return enrollments.filter((enrollment) => assignedCourseIds.has(enrollment.courseId));
}

export function getTeacherStudents({
  students,
  enrollments,
  assignedCourseIds,
}: {
  students: Student[];
  enrollments: Enrollment[];
  assignedCourseIds: Set<number>;
}) {
  const studentIds = new Set(
    enrollments.filter((enrollment) => assignedCourseIds.has(enrollment.courseId)).map((enrollment) => enrollment.studentId),
  );

  return students.filter((student) => studentIds.has(student.id));
}

export function getTeacherSessions({
  sessions,
  assignedCourseIds,
}: {
  sessions: Session[];
  assignedCourseIds: Set<number>;
}) {
  return sessions.filter((session) => assignedCourseIds.has(session.courseId));
}

export function getTeacherAttendanceRecords({
  attendanceRecords,
  teacherSessions,
}: {
  attendanceRecords: AttendanceRecord[];
  teacherSessions: Session[];
}) {
  const sessionIds = new Set(teacherSessions.map((session) => session.id));
  return attendanceRecords.filter((record) => sessionIds.has(record.sessionId));
}

export function countAttendance(records: AttendanceRecord[]) {
  return records.reduce(
    (counts, record) => ({ ...counts, [record.status]: counts[record.status] + 1 }),
    { present: 0, absent: 0, late: 0, excused: 0 } satisfies Record<AttendanceRecord["status"], number>,
  );
}

export function getTeacherAssessments({
  assessments,
  assignedCourseIds,
}: {
  assessments: Assessment[];
  assignedCourseIds: Set<number>;
}) {
  return assessments.filter((assessment) => assignedCourseIds.has(assessment.courseId));
}

export function getScoresByAssessment({
  assessments,
  assessmentScores,
}: {
  assessments: Assessment[];
  assessmentScores: AssessmentScore[];
}) {
  const assessmentIds = new Set(assessments.map((assessment) => assessment.id));

  return new Map(
    assessments.map((assessment) => [
      assessment.id,
      assessmentScores.filter((score) => assessmentIds.has(score.assessmentId) && score.assessmentId === assessment.id),
    ]),
  );
}

export function getCourseStudentCount(courseId: number, enrollments: Enrollment[]) {
  return enrollments.filter((enrollment) => enrollment.courseId === courseId && !enrollment.endDate).length;
}
