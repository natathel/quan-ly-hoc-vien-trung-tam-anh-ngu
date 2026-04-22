import type {
  Assessment,
  AssessmentScore,
  AttendanceRecord,
  Enrollment,
  Invoice,
  Payment,
  Session,
  Student,
} from "@/lib/types";

export const studentStatusLabel: Record<Student["status"], string> = {
  active: "Đang học",
  paused: "Tạm nghỉ",
  graduated: "Hoàn thành",
};

export const attendanceLabel: Record<AttendanceRecord["status"], string> = {
  present: "Có mặt",
  absent: "Vắng",
  late: "Đi trễ",
  excused: "Có phép",
};

export const invoiceLabel: Record<Invoice["status"], string> = {
  draft: "Nháp",
  issued: "Đã phát hành",
  partially_paid: "Thanh toán một phần",
  paid: "Đã thanh toán",
  overdue: "Quá hạn",
  void: "Hủy",
};

export const paymentLabel: Record<Enrollment["paymentStatus"], string> = {
  paid: "Đã thu đủ",
  partial: "Đã thu một phần",
  unpaid: "Chưa thanh toán",
};

export const assessmentTypeLabel: Record<Assessment["assessmentType"], string> = {
  placement: "Đầu vào",
  quiz: "Quiz",
  midterm: "Giữa kỳ",
  final: "Cuối kỳ",
  speaking: "Speaking",
  writing: "Writing",
};

export const paymentMethodLabel: Record<Payment["method"], string> = {
  cash: "Tiền mặt",
  bank_transfer: "Chuyển khoản",
  card: "Thẻ",
  e_wallet: "Ví điện tử",
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

export function getCurrentStudentContext({
  students,
  enrollments,
}: {
  students: Student[];
  enrollments: Enrollment[];
}) {
  const student = students[0];
  const currentEnrollment = student
    ? enrollments.find((item) => item.studentId === student.id && !item.endDate) ??
      enrollments.find((item) => item.studentId === student.id)
    : undefined;

  return { student, currentEnrollment };
}

export function getStudentAttendanceBySession({
  student,
  attendanceRecords,
}: {
  student: Student | undefined;
  attendanceRecords: AttendanceRecord[];
}) {
  const studentAttendance = student
    ? attendanceRecords.filter((record) => record.studentId === student.id)
    : [];

  const attendanceBySession = new Map(studentAttendance.map((record) => [record.sessionId, record]));

  return { studentAttendance, attendanceBySession };
}

export function getStudentAssessmentRows({
  student,
  assessments,
  assessmentScores,
}: {
  student: Student | undefined;
  assessments: Assessment[];
  assessmentScores: AssessmentScore[];
}) {
  return student
    ? assessmentScores
        .filter((score) => score.studentId === student.id)
        .map((score) => ({
          score,
          assessment: assessments.find((assessment) => assessment.id === score.assessmentId),
        }))
    : [];
}

export function getStudentInvoices({
  student,
  invoices,
}: {
  student: Student | undefined;
  invoices: Invoice[];
}) {
  return student ? invoices.filter((invoice) => invoice.studentId === student.id) : [];
}

export function getStudentSessions({
  currentEnrollment,
  sessions,
}: {
  currentEnrollment: Enrollment | undefined;
  sessions: Session[];
}) {
  return currentEnrollment ? sessions.filter((session) => session.courseId === currentEnrollment.courseId) : [];
}
