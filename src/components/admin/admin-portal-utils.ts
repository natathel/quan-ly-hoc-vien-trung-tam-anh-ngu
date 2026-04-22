import type { Course, Enrollment, Invoice, Payment, Student, Teacher } from "@/lib/types";

export type LeadStage = "Mới" | "Đã tư vấn" | "Hẹn kiểm tra đầu vào" | "Chốt ghi danh";

export type LeadItem = {
  id: string;
  fullName: string;
  phone: string;
  source: string;
  interest: string;
  note: string;
  owner: string;
  stage: LeadStage;
  updatedAt: string;
};

export const studentStatusLabel: Record<Student["status"], string> = {
  active: "Đang học",
  paused: "Tạm nghỉ",
  graduated: "Hoàn thành",
};

export const teacherStatusLabel: Record<Teacher["status"], string> = {
  active: "Đang giảng dạy",
  on_leave: "Nghỉ phép",
  inactive: "Ngưng hợp tác",
};

export const paymentStatusLabel: Record<Enrollment["paymentStatus"], string> = {
  paid: "Đã thu đủ",
  partial: "Đã thu một phần",
  unpaid: "Chưa thanh toán",
};

export const invoiceStatusLabel: Record<Invoice["status"], string> = {
  draft: "Nháp",
  issued: "Đã phát hành",
  partially_paid: "Thanh toán một phần",
  paid: "Đã thanh toán",
  overdue: "Quá hạn",
  void: "Huỷ",
};

export const studentStatusClass: Record<Student["status"], string> = {
  active: "border-emerald-500/20 bg-emerald-500/10 text-emerald-200",
  paused: "border-amber-500/20 bg-amber-500/10 text-amber-200",
  graduated: "border-sky-500/20 bg-sky-500/10 text-sky-200",
};

export const teacherStatusClass: Record<Teacher["status"], string> = {
  active: "border-emerald-500/20 bg-emerald-500/10 text-emerald-200",
  on_leave: "border-amber-500/20 bg-amber-500/10 text-amber-200",
  inactive: "border-slate-500/20 bg-slate-500/10 text-slate-200",
};

export const paymentStatusClass: Record<Enrollment["paymentStatus"], string> = {
  paid: "border-emerald-500/20 bg-emerald-500/10 text-emerald-200",
  partial: "border-amber-500/20 bg-amber-500/10 text-amber-200",
  unpaid: "border-rose-500/20 bg-rose-500/10 text-rose-200",
};

export const invoiceStatusClass: Record<Invoice["status"], string> = {
  draft: "border-slate-500/20 bg-slate-500/10 text-slate-200",
  issued: "border-sky-500/20 bg-sky-500/10 text-sky-200",
  partially_paid: "border-amber-500/20 bg-amber-500/10 text-amber-200",
  paid: "border-emerald-500/20 bg-emerald-500/10 text-emerald-200",
  overdue: "border-rose-500/20 bg-rose-500/10 text-rose-200",
  void: "border-slate-500/20 bg-slate-500/10 text-slate-300",
};

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function getCourseEnrollmentCount(courseId: number, enrollments: Enrollment[]) {
  return enrollments.filter((enrollment) => enrollment.courseId === courseId && !enrollment.endDate).length;
}

export function getTeacherCourseCount(teacherName: string, courses: Course[]) {
  return courses.filter((course) => course.teacher === teacherName).length;
}

export function getTeacherStudentCount(teacherName: string, courses: Course[], enrollments: Enrollment[]) {
  const courseIds = new Set(courses.filter((course) => course.teacher === teacherName).map((course) => course.id));
  return new Set(enrollments.filter((enrollment) => courseIds.has(enrollment.courseId)).map((enrollment) => enrollment.studentId)).size;
}

export function getTeacherMonthlyLoad(teacherName: string, courses: Course[], enrollments: Enrollment[]) {
  return courses
    .filter((course) => course.teacher === teacherName)
    .reduce((total, course) => total + getCourseEnrollmentCount(course.id, enrollments) * course.monthlyFee, 0);
}

export function getStudentEnrollmentSummary(studentId: number, enrollments: Enrollment[]) {
  const studentEnrollments = enrollments.filter((enrollment) => enrollment.studentId === studentId);

  return {
    total: studentEnrollments.length,
    active: studentEnrollments.filter((enrollment) => !enrollment.endDate).length,
    unpaid: studentEnrollments.filter((enrollment) => enrollment.paymentStatus !== "paid").length,
  };
}

export function getInvoiceOutstanding(invoice: Invoice) {
  return invoice.outstandingAmount ?? Math.max(invoice.amount - invoice.discount - (invoice.paidAmount ?? 0), 0);
}

export function getInvoicePaymentCount(invoiceId: number, payments: Payment[]) {
  return payments.filter((payment) => payment.invoiceId === invoiceId).length;
}

export function getLeadDemoData(): LeadItem[] {
  return [
    {
      id: "lead-1",
      fullName: "Phạm Thu Ngân",
      phone: "0904000111",
      source: "Landing page",
      interest: "IELTS Foundation cho học sinh lớp 8",
      note: "Phụ huynh muốn kiểm tra đầu vào cuối tuần này.",
      owner: "Tư vấn Lan",
      stage: "Mới",
      updatedAt: "2026-04-20 09:15",
    },
    {
      id: "lead-2",
      fullName: "Ngô Gia Bảo",
      phone: "0905111222",
      source: "Facebook form",
      interest: "Starter Kids A1",
      note: "Đã gọi tư vấn, cần gửi lại lịch học và học phí tháng.",
      owner: "Tư vấn Huy",
      stage: "Đã tư vấn",
      updatedAt: "2026-04-21 14:40",
    },
    {
      id: "lead-3",
      fullName: "Đặng Khánh Vy",
      phone: "0916222333",
      source: "Landing page",
      interest: "Lớp giao tiếp thiếu niên",
      note: "Đã chốt lịch test speaking và grammar vào thứ Bảy.",
      owner: "Tư vấn Mai",
      stage: "Hẹn kiểm tra đầu vào",
      updatedAt: "2026-04-22 10:00",
    },
    {
      id: "lead-4",
      fullName: "Trương Đức Minh",
      phone: "0937333444",
      source: "Giới thiệu phụ huynh",
      interest: "Khoá A2 tăng cường hè",
      note: "Phụ huynh đã đồng ý giữ chỗ, chờ đóng cọc học phí.",
      owner: "Tư vấn Lan",
      stage: "Chốt ghi danh",
      updatedAt: "2026-04-22 16:20",
    },
  ];
}
