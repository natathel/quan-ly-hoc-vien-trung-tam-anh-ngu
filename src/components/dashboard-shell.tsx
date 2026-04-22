import type { Course, DashboardStats, Enrollment, Student } from "@/lib/types";

type DashboardShellProps = {
  stats: DashboardStats;
  students: Student[];
  courses: Course[];
  enrollments: Enrollment[];
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
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

export function DashboardShell({ stats, students, courses, enrollments }: DashboardShellProps) {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-4 rounded-3xl border border-white/10 bg-gradient-to-r from-sky-500/20 via-slate-900 to-emerald-500/10 p-6 shadow-2xl shadow-sky-950/30 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
          <div className="space-y-4">
            <span className="inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
              Next.js Full Stack + SQLite
            </span>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Quản lý học viên trung tâm anh ngữ
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Dashboard tổng hợp học viên, lớp học, ghi danh và công nợ học phí cho trung tâm anh ngữ.
                Dự án dùng App Router của Next.js, API Route Handlers cho backend và SQLite để lưu trữ dữ liệu.
              </p>
            </div>
          </div>

          <div className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 backdrop-blur">
            <p className="text-sm font-medium text-slate-300">Tình trạng vận hành</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-slate-400">Học viên hoạt động</p>
                <p className="mt-2 text-2xl font-semibold text-white">{stats.activeStudents}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-slate-400">Lớp đang mở</p>
                <p className="mt-2 text-2xl font-semibold text-white">{stats.activeCourses}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[
            { label: "Tổng học viên", value: stats.totalStudents, accent: "text-sky-300" },
            { label: "Đang học", value: stats.activeStudents, accent: "text-emerald-300" },
            { label: "Lớp đang mở", value: stats.activeCourses, accent: "text-violet-300" },
            { label: "Doanh thu dự kiến", value: formatCurrency(stats.monthlyRevenue), accent: "text-amber-300" },
            { label: "Công suất lớp", value: `${stats.capacityUsage}%`, accent: "text-rose-300" },
          ].map((item) => (
            <article key={item.label} className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/30">
              <p className="text-sm text-slate-400">{item.label}</p>
              <p className={`mt-3 text-2xl font-semibold ${item.accent}`}>{item.value}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/30">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-white">Danh sách học viên</h2>
                <p className="mt-1 text-sm text-slate-400">Theo dõi trạng thái, trình độ và ngày nhập học.</p>
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
                    <th className="px-4 py-3 font-medium">Liên hệ</th>
                    <th className="px-4 py-3 font-medium">Trình độ</th>
                    <th className="px-4 py-3 font-medium">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 bg-slate-950/40 text-slate-200">
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td className="px-4 py-4 align-top">
                        <p className="font-medium text-white">{student.fullName}</p>
                        <p className="mt-1 text-xs text-slate-400">Nhập học: {student.enrollmentDate}</p>
                      </td>
                      <td className="px-4 py-4 align-top text-sm text-slate-300">
                        <p>{student.phone}</p>
                        <p className="mt-1 text-xs text-slate-400">{student.email}</p>
                      </td>
                      <td className="px-4 py-4 align-top">{student.level}</td>
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

          <article className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/30">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-white">Danh sách lớp học</h2>
              <p className="mt-1 text-sm text-slate-400">Tổng hợp giáo viên, lịch học và sĩ số tối đa.</p>
            </div>

            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-white">{course.name}</h3>
                      <p className="mt-1 text-sm text-slate-400">{course.level} • {course.teacher}</p>
                    </div>
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
                      Sĩ số {course.capacity}
                    </span>
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

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/30">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Công nợ học phí</h2>
                <p className="mt-1 text-sm text-slate-400">Theo dõi tình trạng thu phí theo từng ghi danh.</p>
              </div>
              <span className="rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-200">
                {stats.unpaidEnrollments} chưa thu đủ
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

          <article className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/30">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-white">Kiến trúc backend đã có sẵn</h2>
              <p className="mt-1 text-sm text-slate-400">
                Hệ thống đã scaffold đầy đủ API và lớp truy cập dữ liệu để anh mở rộng tiếp thành sản phẩm thật.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "API học viên",
                  endpoint: "GET/POST /api/students",
                  description: "Tìm kiếm, thêm học viên mới, validate bằng Zod.",
                },
                {
                  title: "API lớp học",
                  endpoint: "GET/POST /api/courses",
                  description: "Quản lý lớp, giáo viên, học phí, sức chứa.",
                },
                {
                  title: "API ghi danh",
                  endpoint: "GET/POST /api/enrollments",
                  description: "Liên kết học viên với lớp và trạng thái thanh toán.",
                },
                {
                  title: "API dashboard",
                  endpoint: "GET /api/dashboard",
                  description: "Trả số liệu tổng hợp cho giao diện quản trị.",
                },
              ].map((item) => (
                <div key={item.endpoint} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-2 inline-flex rounded-full bg-sky-500/10 px-3 py-1 text-xs text-sky-200">
                    {item.endpoint}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{item.description}</p>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
