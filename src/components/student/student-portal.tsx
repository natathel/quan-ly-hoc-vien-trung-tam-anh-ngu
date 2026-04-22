import Link from "next/link";

import { PortalNav } from "@/components/shared/portal-nav";
import { SectionCard } from "@/components/shared/section-card";
import type {
  Assessment,
  AssessmentScore,
  AttendanceRecord,
  DashboardStats,
  Enrollment,
  Invoice,
  Notification,
  OperationalSummary,
  Session,
  Student,
} from "@/lib/types";

type StudentPortalProps = {
  students: Student[];
  enrollments: Enrollment[];
  sessions: Session[];
  attendanceRecords: AttendanceRecord[];
  assessments: Assessment[];
  assessmentScores: AssessmentScore[];
  invoices: Invoice[];
  notifications: Notification[];
  stats: DashboardStats;
  summary: OperationalSummary;
};

const studentStatusLabel: Record<Student["status"], string> = {
  active: "Đang học",
  paused: "Tạm nghỉ",
  graduated: "Hoàn thành",
};

const attendanceLabel: Record<AttendanceRecord["status"], string> = {
  present: "Có mặt",
  absent: "Vắng",
  late: "Đi trễ",
  excused: "Có phép",
};

const invoiceLabel: Record<Invoice["status"], string> = {
  draft: "Nháp",
  issued: "Đã phát hành",
  partially_paid: "Thanh toán một phần",
  paid: "Đã thanh toán",
  overdue: "Quá hạn",
  void: "Hủy",
};

const paymentLabel: Record<Enrollment["paymentStatus"], string> = {
  paid: "Đã thu đủ",
  partial: "Đã thu một phần",
  unpaid: "Chưa thanh toán",
};

const notificationPriorityLabel: Record<Notification["priority"], string> = {
  normal: "Thông tin",
  high: "Ưu tiên cao",
  critical: "Khẩn",
};

const notificationPriorityClass: Record<Notification["priority"], string> = {
  normal: "border-sky-500/20 bg-sky-500/10 text-sky-100",
  high: "border-amber-500/20 bg-amber-500/10 text-amber-100",
  critical: "border-rose-500/20 bg-rose-500/10 text-rose-100",
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatScore(value?: number) {
  if (value === undefined || Number.isNaN(value)) return "-";
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function isStudentVisibleNotification(notification: Notification, today = todayIso()) {
  return (notification.audience === "all" || notification.audience === "students")
    && notification.publishedAt <= today
    && (!notification.expiresAt || notification.expiresAt >= today);
}

export function StudentPortal({
  students,
  enrollments,
  sessions,
  attendanceRecords,
  assessments,
  assessmentScores,
  invoices,
  notifications,
  stats,
  summary,
}: StudentPortalProps) {
  const student = students[0];
  const currentEnrollment = student
    ? enrollments.find((item) => item.studentId === student.id && !item.endDate) ??
      enrollments.find((item) => item.studentId === student.id)
    : undefined;
  const studentSessions = currentEnrollment
    ? sessions.filter((session) => session.courseId === currentEnrollment.courseId)
    : [];
  const upcomingSessions = studentSessions.filter((session) => session.status === "scheduled").slice(0, 4);
  const studentAttendance = student
    ? attendanceRecords.filter((record) => record.studentId === student.id)
    : [];
  const attendedCount = studentAttendance.filter((record) => record.status === "present" || record.status === "late").length;
  const attendanceRate = studentAttendance.length ? Math.round((attendedCount / studentAttendance.length) * 100) : stats.attendanceRate;
  const studentScores = student
    ? assessmentScores.filter((score) => score.studentId === student.id).slice(0, 5)
    : [];
  const studentAssessmentRows = studentScores.map((score) => ({
    score,
    assessment: assessments.find((assessment) => assessment.id === score.assessmentId),
  }));
  const openInvoices = student
    ? invoices.filter((invoice) => invoice.studentId === student.id && !["paid", "void"].includes(invoice.status))
    : [];
  const careItems = student
    ? summary.studentCareList.filter((item) => item.studentId === student.id)
    : [];
  const studentNotifications = notifications.filter((notification) => isStudentVisibleNotification(notification));

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <PortalNav active="student" />

        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-sky-500/20 via-slate-900 to-emerald-500/10 p-8 shadow-2xl shadow-sky-950/20">
          <span className="inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">
            Student portal • học viên & phụ huynh
          </span>
          <div className="mt-4 grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {student ? `Xin chào ${student.fullName}` : "Portal học viên demo"}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                Theo dõi hồ sơ học tập, lớp đang học, buổi sắp tới, điểm danh, đánh giá và học phí mở trong một màn hình dành cho học viên/phụ huynh.
              </p>
            </div>
            <div className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
              <p>Tỷ lệ điểm danh cá nhân: <span className="font-semibold text-emerald-300">{attendanceRate}%</span></p>
              <p>Điểm trung bình trung tâm: <span className="font-semibold text-sky-300">{formatScore(stats.averageScore)}</span></p>
              <p>Cảnh báo cần theo dõi: <span className="font-semibold text-amber-300">{careItems.length}</span></p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionCard title="Hồ sơ học viên" description="Thông tin demo lấy từ học viên đầu tiên trong hệ thống." accent="sky">
            {student ? (
              <div className="mb-4 flex flex-wrap gap-3">
                <Link href="/admin#students" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-sky-400/30 hover:text-sky-200">
                  Xem hồ sơ tại admin
                </Link>
                <Link href="/teacher" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-emerald-400/30 hover:text-emerald-200">
                  Liên hệ giáo viên phụ trách
                </Link>
              </div>
            ) : null}
            {student ? (
              <div className="space-y-3 text-sm text-slate-300">
                <p className="text-xl font-semibold text-white">{student.fullName}</p>
                <p>{student.level} • {studentStatusLabel[student.status]} • Nhập học {student.enrollmentDate}</p>
                <p>{student.phone} • {student.email}</p>
                <p>Phụ huynh: {student.guardianName || "Chưa cập nhật"} • {student.guardianPhone || "Chưa cập nhật"}</p>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="font-medium text-white">Mục tiêu học tập</p>
                  <p className="mt-2 leading-6">{student.learningGoal || "Chưa cập nhật"}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-300">Chưa có học viên demo.</p>
            )}
          </SectionCard>

          <SectionCard title="Lớp đang học" description="Ghi danh hiện tại và thông tin lớp/giáo viên phụ trách." accent="emerald">
            {currentEnrollment ? (
              <div className="grid gap-3 text-sm text-slate-300 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-lg font-semibold text-white">{currentEnrollment.courseName}</p>
                  <p className="mt-2">Trình độ: {currentEnrollment.level}</p>
                  <p className="mt-1">Giáo viên: {currentEnrollment.teacher}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p>Bắt đầu: {currentEnrollment.startDate}</p>
                  <p className="mt-1">Học phí: {formatCurrency(currentEnrollment.monthlyFee ?? 0)}</p>
                  <p className="mt-1">Thanh toán: {paymentLabel[currentEnrollment.paymentStatus]}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-300">Chưa có ghi danh phù hợp.</p>
            )}
          </SectionCard>
        </section>

        <section className="grid gap-4 xl:grid-cols-3">
          <SectionCard title="Buổi học sắp tới" description="Các buổi scheduled của lớp hiện tại." accent="violet">
            <Link href="/student/schedule" className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-violet-400/30 hover:text-violet-200">
              Xem lịch học chi tiết
            </Link>
            <div className="space-y-3">
              {(upcomingSessions.length ? upcomingSessions : summary.upcomingSessions.slice(0, 3)).map((session) => (
                <div key={session.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  <p className="font-semibold text-white">{session.courseName}</p>
                  <p className="mt-1">{session.sessionDate} • {session.startTime}-{session.endTime}</p>
                  <p className="mt-1 text-slate-400">{session.topic}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Điểm danh & tiến bộ" description="Tổng hợp điểm danh cá nhân và tiến độ vận hành." accent="amber">
            <div className="grid gap-3 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-2xl font-semibold text-white">{attendanceRate}%</p>
                <p className="mt-1">Tỷ lệ tham gia quy đổi</p>
              </div>
              {studentAttendance.slice(0, 4).map((record) => (
                <p key={record.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  Buổi #{record.sessionId}: {attendanceLabel[record.status]} {record.note ? `• ${record.note}` : ""}
                </p>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Yêu cầu học vụ" description="Mở luồng hỗ trợ end-to-end cho đổi lịch, học phí và hỗ trợ học tập." accent="rose">
            <Link href="/student/requests" className="mb-4 inline-flex rounded-full border border-rose-400/20 bg-rose-400/10 px-4 py-2 text-sm font-medium text-rose-100 transition hover:border-rose-300/40 hover:text-white">
              Vào trung tâm yêu cầu học viên
            </Link>
            <div className="grid gap-3 text-sm">
              {[
                "Xin nghỉ / đổi buổi học",
                "Yêu cầu chuyển lớp",
                "Trao đổi học phí",
                "Liên hệ giáo vụ & hỗ trợ",
              ].map((action) => (
                <Link key={action} href="/student/requests" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left font-medium text-white transition hover:border-sky-400/30 hover:text-sky-200">
                  {action}
                </Link>
              ))}
            </div>
          </SectionCard>
        </section>

        <section>
          <SectionCard title="Thông báo dành cho học viên" description="Announcement dành cho audience students/all để phụ huynh và học viên nắm lịch vận hành mới nhất." accent="violet">
            <div className="space-y-3">
              {studentNotifications.length ? (
                studentNotifications.slice(0, 3).map((notification) => (
                  <article key={notification.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-semibold text-white">{notification.title}</p>
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${notificationPriorityClass[notification.priority]}`}>
                        {notificationPriorityLabel[notification.priority]}
                      </span>
                    </div>
                    <p className="mt-2 leading-6">{notification.message}</p>
                    <p className="mt-3 text-xs text-slate-500">
                      Hiệu lực từ {notification.publishedAt}
                      {notification.expiresAt ? ` • hết hạn ${notification.expiresAt}` : " • đang áp dụng"}
                    </p>
                  </article>
                ))
              ) : (
                <p className="text-sm text-slate-300">Chưa có thông báo công khai cho học viên.</p>
              )}
            </div>
          </SectionCard>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Đánh giá gần đây" description="Điểm số của học viên trong các bài assessment đã ghi nhận." accent="sky">
            <Link href="/student/assessments" className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-sky-400/30 hover:text-sky-200">
              Xem bảng điểm đầy đủ
            </Link>
            <div className="space-y-3">
              {studentAssessmentRows.length ? studentAssessmentRows.map(({ score, assessment }) => (
                <div key={score.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold text-white">{assessment?.title ?? `Assessment #${score.assessmentId}`}</p>
                    <span className="rounded-full bg-sky-400/10 px-3 py-1 text-sky-200">{formatScore(score.score)}</span>
                  </div>
                  <p className="mt-2">{assessment?.courseName ?? currentEnrollment?.courseName ?? "Lớp học"}</p>
                  <p className="mt-1 text-slate-400">{score.feedback || "Chưa có nhận xét"}</p>
                </div>
              )) : (
                <p className="text-sm text-slate-300">Chưa có điểm cá nhân, hiển thị điểm trung tâm: {formatScore(stats.averageScore)}</p>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Học phí & hóa đơn mở" description="Theo dõi các chứng từ chưa tất toán của học viên demo." accent="emerald">
            <Link href="/student/payments" className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-emerald-400/30 hover:text-emerald-200">
              Xem chi tiết thanh toán
            </Link>
            <div className="space-y-3">
              {openInvoices.length ? openInvoices.map((invoice) => (
                <div key={invoice.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold text-white">{invoice.invoiceNo}</p>
                    <span className="rounded-full bg-amber-400/10 px-3 py-1 text-amber-200">{invoiceLabel[invoice.status]}</span>
                  </div>
                  <p className="mt-2">Hạn thanh toán: {invoice.dueDate}</p>
                  <p className="mt-1">Đã thu: {formatCurrency(invoice.paidAmount ?? 0)}</p>
                  <p className="mt-1 text-rose-200">Còn thiếu: {formatCurrency(invoice.outstandingAmount ?? 0)}</p>
                </div>
              )) : (
                <p className="text-sm text-slate-300">Không có hóa đơn mở cho học viên demo.</p>
              )}
            </div>
          </SectionCard>
        </section>
      </div>
    </main>
  );
}
