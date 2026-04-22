import Link from "next/link";

import { PortalNav } from "@/components/shared/portal-nav";
import type { Assessment, Course, DashboardStats, Enrollment, Invoice, OperationalSummary, Student, Teacher } from "@/lib/types";

type DashboardShellProps = {
  stats: DashboardStats;
  summary: OperationalSummary;
  students: Student[];
  courses: Course[];
  enrollments: Enrollment[];
  teachers: Teacher[];
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

const statusLabel: Record<Student["status"], string> = {
  active: "Đang học",
  paused: "Tạm nghỉ",
  graduated: "Hoàn thành",
};

const paymentLabel: Record<Enrollment["paymentStatus"], string> = {
  paid: "Đã thu",
  partial: "Thu một phần",
  unpaid: "Chưa thu",
};

const teacherStatusLabel: Record<Teacher["status"], string> = {
  active: "Đang giảng dạy",
  on_leave: "Nghỉ phép",
  inactive: "Ngưng hợp tác",
};

const invoiceStatusLabel: Record<Invoice["status"], string> = {
  draft: "Nháp",
  issued: "Đã phát hành",
  partially_paid: "Thanh toán một phần",
  paid: "Đã thanh toán",
  overdue: "Quá hạn",
  void: "Hủy",
};

const assessmentTypeLabel: Record<Assessment["assessmentType"], string> = {
  placement: "Đầu vào",
  quiz: "Quiz",
  midterm: "Giữa kỳ",
  final: "Cuối kỳ",
  speaking: "Speaking",
  writing: "Writing",
};

const badgeClass: Record<Student["status"], string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  paused: "bg-amber-50 text-amber-700 ring-amber-200",
  graduated: "bg-sky-50 text-sky-700 ring-sky-200",
};

const paymentClass: Record<Enrollment["paymentStatus"], string> = {
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  partial: "bg-amber-50 text-amber-700 ring-amber-200",
  unpaid: "bg-rose-50 text-rose-700 ring-rose-200",
};

const teacherBadgeClass: Record<Teacher["status"], string> = {
  active: "bg-emerald-500/10 text-emerald-200 border-emerald-500/20",
  on_leave: "bg-amber-500/10 text-amber-200 border-amber-500/20",
  inactive: "bg-slate-500/10 text-slate-200 border-slate-500/20",
};

const invoiceBadgeClass: Record<Invoice["status"], string> = {
  draft: "bg-slate-500/10 text-slate-200 border-slate-500/20",
  issued: "bg-sky-500/10 text-sky-200 border-sky-500/20",
  partially_paid: "bg-amber-500/10 text-amber-200 border-amber-500/20",
  paid: "bg-emerald-500/10 text-emerald-200 border-emerald-500/20",
  overdue: "bg-rose-500/10 text-rose-200 border-rose-500/20",
  void: "bg-slate-500/10 text-slate-300 border-slate-500/20",
};

const careSeverityClass = {
  low: "border-sky-500/20 bg-sky-500/10 text-sky-200",
  medium: "border-amber-500/20 bg-amber-500/10 text-amber-200",
  high: "border-rose-500/20 bg-rose-500/10 text-rose-200",
};

const adminModules = [
  { title: "Học viên", href: "/admin/students", description: "Quản lý hồ sơ, phụ huynh và trạng thái học tập.", accent: "text-sky-300" },
  { title: "Giáo viên", href: "/admin/teachers", description: "Điều phối năng lực giảng dạy và lịch công tác.", accent: "text-emerald-300" },
  { title: "Khoá học", href: "/admin/courses", description: "Theo dõi lớp mở, lịch học và công suất.", accent: "text-violet-300" },
  { title: "Ghi danh", href: "/admin/enrollments", description: "Kiểm soát ghi danh và trạng thái thanh toán.", accent: "text-amber-300" },
  { title: "Hóa đơn", href: "/admin/invoices", description: "Theo dõi chứng từ, công nợ và hạn thanh toán.", accent: "text-rose-300" },
  { title: "Yêu cầu học viên", href: "/admin/requests", description: "Xử lý ticket đổi lớp, lịch học, học phí và hỗ trợ học vụ.", accent: "text-fuchsia-300" },
  { title: "Thông báo", href: "/admin/notifications", description: "Điều phối announcement theo audience, priority và API vận hành.", accent: "text-lime-300" },
  { title: "Lead tuyển sinh", href: "/admin/leads", description: "Bảng CRM minh hoạ cho lead từ landing page và marketing.", accent: "text-cyan-300" },
] as const;

export function DashboardShell({ stats, summary, students, courses, enrollments, teachers }: DashboardShellProps) {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <PortalNav active="admin" />

        <section className="grid gap-4 rounded-3xl border border-white/10 bg-gradient-to-r from-sky-500/15 via-slate-900 to-emerald-500/10 p-6 shadow-2xl shadow-sky-950/30 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-4">
            <span className="inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
              Admin portal • Điều hành trung tâm
            </span>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Bảng điều hành admin cho kiến trúc 4 portal của trung tâm anh ngữ
              </h1>
              <p className="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                Admin portal giữ vai trò trung tâm điều phối học vụ, giảng dạy, tài chính, báo cáo và
                các module mở rộng, đồng thời liên kết trực tiếp với landing, student portal và teacher portal.
              </p>
            </div>
          </div>

          <div className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 backdrop-blur">
            <p className="text-sm font-medium text-slate-300">Tình trạng vận hành</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-slate-400">Giáo viên active</p>
                <p className="mt-2 text-2xl font-semibold text-white">{stats.activeTeachers}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-slate-400">Buổi sắp dạy</p>
                <p className="mt-2 text-2xl font-semibold text-white">{stats.scheduledSessions}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              <p>Tỷ lệ điểm danh: <span className="font-semibold text-emerald-300">{stats.attendanceRate}%</span></p>
              <p className="mt-1">Điểm trung bình: <span className="font-semibold text-sky-300">{formatScore(stats.averageScore)}</span></p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {adminModules.map((module) => (
            <Link
              key={module.title}
              href={module.href}
              className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/30 transition hover:border-sky-400/30 hover:bg-slate-900"
            >
              <p className={`text-sm font-semibold ${module.accent}`}>{module.title}</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">{module.description}</p>
            </Link>
          ))}
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Tổng học viên", value: stats.totalStudents, accent: "text-sky-300" },
            { label: "Đang học", value: stats.activeStudents, accent: "text-emerald-300" },
            { label: "Lớp đang mở", value: stats.activeCourses, accent: "text-violet-300" },
            { label: "Giáo viên active", value: stats.activeTeachers, accent: "text-cyan-300" },
            { label: "Doanh thu dự kiến", value: formatCurrency(stats.monthlyRevenue), accent: "text-amber-300" },
            { label: "Đã thu học phí", value: formatCurrency(stats.collectedTuition), accent: "text-lime-300" },
            { label: "Còn phải thu", value: formatCurrency(stats.outstandingTuition), accent: "text-rose-300" },
            { label: "Công suất lớp", value: `${stats.capacityUsage}%`, accent: "text-fuchsia-300" },
          ].map((item) => (
            <article key={item.label} className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/30">
              <p className="text-sm text-slate-400">{item.label}</p>
              <p className={`mt-3 text-2xl font-semibold ${item.accent}`}>{item.value}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <article className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/30">
            <h2 className="text-lg font-semibold text-white">Điều hành giảng dạy</h2>
            <div className="mt-4 grid gap-3 text-sm">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-slate-400">Buổi scheduled</p>
                <p className="mt-2 text-2xl font-semibold text-white">{stats.scheduledSessions}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-slate-400">Buổi completed</p>
                <p className="mt-2 text-2xl font-semibold text-white">{stats.completedSessions}</p>
              </div>
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/30">
            <h2 className="text-lg font-semibold text-white">Tài chính & chứng từ</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p>Hóa đơn đã phát hành</p>
                <p className="mt-2 text-2xl font-semibold text-white">{stats.issuedInvoices}</p>
              </div>
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-rose-100">
                <p>Hóa đơn quá hạn</p>
                <p className="mt-2 text-2xl font-semibold">{stats.overdueInvoices}</p>
              </div>
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/30">
            <h2 className="text-lg font-semibold text-white">Chất lượng đào tạo</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p>Điểm trung bình</p>
                <p className="mt-2 text-2xl font-semibold text-white">{formatScore(stats.averageScore)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p>Tỷ lệ điểm danh quy đổi</p>
                <p className="mt-2 text-2xl font-semibold text-white">{stats.attendanceRate}%</p>
              </div>
            </div>
          </article>
        </section>

        <section id="students" className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/30">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-white">Danh sách học viên</h2>
                <p className="mt-1 text-sm text-slate-400">Theo dõi hồ sơ học vụ, phụ huynh và mục tiêu học tập.</p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                {students.length} hồ sơ
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="min-w-full divide-y divide-white/10 text-sm">
                <thead className="bg-white/5 text-left text-slate-300">
                  <tr>
                    <th className="px-4 py-3 font-medium">Học viên</th>
                    <th className="px-4 py-3 font-medium">Phụ huynh</th>
                    <th className="px-4 py-3 font-medium">Mục tiêu</th>
                    <th className="px-4 py-3 font-medium">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 bg-slate-950/40 text-slate-200">
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td className="px-4 py-4 align-top">
                        <p className="font-medium text-white">{student.fullName}</p>
                        <p className="mt-1 text-xs text-slate-400">{student.level} • Nhập học: {student.enrollmentDate}</p>
                        <p className="mt-1 text-xs text-slate-500">{student.phone} • {student.email}</p>
                      </td>
                      <td className="px-4 py-4 align-top text-sm text-slate-300">
                        <p>{student.guardianName || "-"}</p>
                        <p className="mt-1 text-xs text-slate-400">{student.guardianPhone || "Chưa có"}</p>
                      </td>
                      <td className="px-4 py-4 align-top text-sm text-slate-300">
                        <p>{student.learningGoal || "Chưa cập nhật"}</p>
                        <p className="mt-1 text-xs text-slate-500">{student.notes || "-"}</p>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ${badgeClass[student.status]}`}>
                          {statusLabel[student.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article id="teachers" className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/30">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-white">Giáo viên & năng lực</h2>
              <p className="mt-1 text-sm text-slate-400">Phân bổ nguồn lực giảng dạy theo chuyên môn.</p>
            </div>

            <div className="space-y-4">
              {teachers.map((teacher) => (
                <div key={teacher.id} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-white">{teacher.fullName}</h3>
                      <p className="mt-1 text-sm text-slate-400">{teacher.specialization}</p>
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-xs ${teacherBadgeClass[teacher.status]}`}>
                      {teacherStatusLabel[teacher.status]}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-2 text-sm text-slate-300">
                    <p>{teacher.phone} • {teacher.email}</p>
                    <p>Lương giờ: {formatCurrency(teacher.hourlyRate)}</p>
                    <p className="text-slate-400">{teacher.notes || "Không có ghi chú"}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section id="enrollments" className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <article className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/30">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Ghi danh & học phí</h2>
                <p className="mt-1 text-sm text-slate-400">Theo dõi tình trạng học tập và thanh toán theo từng ghi danh.</p>
              </div>
              <span className="rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-200">
                {stats.unpaidEnrollments} ghi danh chưa thu đủ
              </span>
            </div>

            <div className="space-y-3">
              {enrollments.map((enrollment) => (
                <div key={enrollment.id} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{enrollment.studentName}</p>
                      <p className="mt-1 text-sm text-slate-400">{enrollment.courseName} • {enrollment.teacher}</p>
                    </div>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ${paymentClass[enrollment.paymentStatus]}`}>
                      {paymentLabel[enrollment.paymentStatus]}
                    </span>
                  </div>
                  <div className="mt-3 text-sm text-slate-300">
                    <p>Bắt đầu: {enrollment.startDate}</p>
                    <p className="mt-1">Học phí: {formatCurrency(enrollment.monthlyFee ?? 0)}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article id="courses" className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/30">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-white">Lớp học đang vận hành</h2>
              <p className="mt-1 text-sm text-slate-400">Sĩ số, lịch học, giáo viên và doanh thu tiêu chuẩn.</p>
            </div>

            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-white">{course.name}</h3>
                      <p className="mt-1 text-sm text-slate-400">{course.level} • {course.teacher}</p>
                    </div>
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">Sĩ số {course.capacity}</span>
                  </div>
                  <div className="mt-4 grid gap-2 text-sm text-slate-300">
                    <p>Lịch học: {course.schedule}</p>
                    <p>Học phí/tháng: {formatCurrency(course.monthlyFee)}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section id="reports" className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/30">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-white">Buổi học sắp tới</h2>
              <p className="mt-1 text-sm text-slate-400">Theo dõi lịch dạy, giáo viên phụ trách và rủi ro vắng học.</p>
            </div>
            <div className="space-y-3">
              {summary.upcomingSessions.map((session) => (
                <div key={session.id} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{session.courseName}</p>
                      <p className="mt-1 text-sm text-slate-400">{session.teacherName} • {session.sessionDate} • {session.startTime}-{session.endTime}</p>
                    </div>
                    <span className="rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs text-sky-200">
                      {session.status}
                    </span>
                  </div>
                  <div className="mt-3 text-sm text-slate-300">
                    <p>Chủ đề: {session.topic}</p>
                    <p className="mt-1 text-slate-400">BTVN: {session.homework || "Chưa cập nhật"}</p>
                    <p className="mt-1 text-slate-500">Điểm danh đã ghi: {session.attendanceTotal ?? 0} • Vắng: {session.absentCount ?? 0}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/30">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-white">Danh sách chăm sóc ưu tiên</h2>
              <p className="mt-1 text-sm text-slate-400">Học viên cần follow-up về học tập, điểm danh hoặc tài chính.</p>
            </div>
            <div className="space-y-3">
              {summary.studentCareList.map((item) => (
                <div key={`${item.studentId}-${item.reason}`} className={`rounded-2xl border p-4 text-sm ${careSeverityClass[item.severity]}`}>
                  <p className="font-semibold text-white">{item.studentName}</p>
                  <p className="mt-1">{item.reason}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/30">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-white">Đánh giá học tập gần đây</h2>
              <p className="mt-1 text-sm text-slate-400">Bảng điểm nhanh để theo dõi chất lượng đào tạo theo lớp.</p>
            </div>
            <div className="space-y-3">
              {summary.recentAssessments.map((assessment) => (
                <div key={assessment.id} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{assessment.title}</p>
                      <p className="mt-1 text-sm text-slate-400">{assessment.courseName} • {assessment.assessmentDate}</p>
                    </div>
                    <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-200">
                      {assessmentTypeLabel[assessment.assessmentType]}
                    </span>
                  </div>
                  <div className="mt-3 grid gap-1 text-sm text-slate-300">
                    <p>Điểm TB: {formatScore(assessment.averageScore)} / {formatScore(assessment.maxScore)}</p>
                    <p>Số bài đã chấm: {assessment.scoreCount ?? 0}</p>
                    <p>Trọng số: {assessment.weight}%</p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article id="finance" className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/30">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-white">Cảnh báo học phí & chứng từ</h2>
              <p className="mt-1 text-sm text-slate-400">Theo dõi hóa đơn mở, công nợ và tình trạng thanh toán.</p>
            </div>

            <div className="space-y-3">
              {summary.openInvoices.map((invoice) => (
                <div key={invoice.id} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{invoice.invoiceNo}</p>
                      <p className="mt-1 text-sm text-slate-400">{invoice.studentName} • {invoice.courseName ?? "Chứng từ chung"}</p>
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-xs ${invoiceBadgeClass[invoice.status]}`}>
                      {invoiceStatusLabel[invoice.status]}
                    </span>
                  </div>
                  <div className="mt-3 grid gap-1 text-sm text-slate-300">
                    <p>Hạn thanh toán: {invoice.dueDate}</p>
                    <p>Tổng tiền: {formatCurrency(invoice.amount - invoice.discount)}</p>
                    <p>Đã thu: {formatCurrency(invoice.paidAmount ?? 0)}</p>
                    <p className="text-rose-200">Còn thiếu: {formatCurrency(invoice.outstandingAmount ?? 0)}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section id="permissions" className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/30">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-white">Năng lực backend phase 1</h2>
            <p className="mt-1 text-sm text-slate-400">Các API đã sẵn sàng để anh tiếp tục mở rộng CRUD chi tiết, phân quyền và báo cáo chuyên sâu ở phase sau.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[
              { title: "Học viên", endpoint: "GET/POST /api/students", description: "Hồ sơ học viên + phụ huynh + mục tiêu học tập." },
              { title: "Lớp học", endpoint: "GET/POST /api/courses", description: "Quản lý lớp, lịch học chuẩn, sức chứa và giáo viên phụ trách." },
              { title: "Ghi danh", endpoint: "GET/POST /api/enrollments", description: "Theo dõi ghi danh và tình trạng thanh toán." },
              { title: "Giáo viên", endpoint: "GET/POST /api/teachers", description: "Quản lý nguồn lực giảng dạy, chuyên môn và trạng thái công tác." },
              { title: "Buổi học", endpoint: "GET/POST /api/sessions", description: "Lập lịch buổi dạy, chủ đề, bài tập và tình trạng thực hiện." },
              { title: "Đánh giá", endpoint: "GET/POST /api/assessments", description: "Quản lý bài kiểm tra, điểm số và chất lượng đào tạo." },
              { title: "Chứng từ", endpoint: "GET/POST /api/invoices", description: "Phát hành hóa đơn học phí và theo dõi công nợ." },
              { title: "Thanh toán", endpoint: "GET/POST /api/payments", description: "Ghi nhận thanh toán và tự động cập nhật trạng thái hóa đơn." },
              { title: "Dashboard", endpoint: "GET /api/dashboard", description: "Trả KPI và summary điều hành đa phân hệ." },
            ].map((item) => (
              <div key={item.endpoint} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-2 inline-flex rounded-full bg-sky-500/10 px-3 py-1 text-xs text-sky-200">{item.endpoint}</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
