import Link from "next/link";

import { PortalNav } from "@/components/shared/portal-nav";
import { SectionCard } from "@/components/shared/section-card";
import type { Assessment, Course, Enrollment, OperationalSummary, Session, Teacher } from "@/lib/types";

import { formatCurrency, formatScore, getCurrentTeacherContext, teacherStatusLabel } from "./teacher-portal-utils";

const teacherSubpages = [
  { href: "/teacher", label: "Tổng quan" },
  { href: "/teacher/classes", label: "Lớp phụ trách" },
  { href: "/teacher/attendance", label: "Điểm danh" },
  { href: "/teacher/assessments", label: "Đánh giá" },
] as const;

type TeacherPortalProps = {
  teachers: Teacher[];
  courses: Course[];
  enrollments: Enrollment[];
  sessions: Session[];
  assessments: Assessment[];
  summary: OperationalSummary;
};

export function TeacherPortal({ teachers, courses, enrollments, sessions, assessments, summary }: TeacherPortalProps) {
  const { teacher, assignedCourses, assignedCourseIds } = getCurrentTeacherContext({ teachers, courses });
  const upcomingSessions = sessions
    .filter((session) => assignedCourseIds.has(session.courseId) && session.status === "scheduled")
    .slice(0, 5);
  const teacherAssessments = assessments.filter((assessment) => assignedCourseIds.has(assessment.courseId)).slice(0, 5);
  const activeStudentCount = enrollments.filter((enrollment) => assignedCourseIds.has(enrollment.courseId)).length;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <PortalNav active="teacher" />

        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/20 via-slate-900 to-sky-500/10 p-8 shadow-2xl shadow-emerald-950/20">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200">
                Cổng giáo viên • lịch dạy & chất lượng lớp
              </span>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {teacher ? `Chào ${teacher.fullName}` : "Cổng giáo viên demo"}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                Không gian dành cho giáo viên xem lịch dạy, lớp phụ trách, điểm danh, đánh giá và danh sách học viên cần phối hợp chăm sóc.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {teacherSubpages.map((item) => {
                const isActive = item.href === "/teacher";

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition ${
                      isActive
                        ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-100"
                        : "border-white/10 bg-white/5 text-slate-300 hover:border-emerald-400/30 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-center text-sm">
            <div>
              <p className="text-2xl font-semibold text-white">{assignedCourses.length}</p>
              <p className="mt-1 text-slate-400">Lớp</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">{upcomingSessions.length}</p>
              <p className="mt-1 text-slate-400">Buổi tới</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">{activeStudentCount}</p>
              <p className="mt-1 text-slate-400">Ghi danh</p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionCard title="Hồ sơ giáo viên" description="Giáo viên active đầu tiên được dùng làm demo context." accent="emerald">
            {teacher ? (
              <div className="mb-4 flex flex-wrap gap-3">
                <Link href="/teacher/classes" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-emerald-400/30 hover:text-emerald-200">
                  Xem lớp phụ trách
                </Link>
                <Link href="/teacher/attendance" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-sky-400/30 hover:text-sky-200">
                  Mở điểm danh
                </Link>
                <Link href="/teacher/assessments" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-rose-400/30 hover:text-rose-200">
                  Xem đánh giá
                </Link>
              </div>
            ) : null}
            {teacher ? (
              <div className="space-y-3 text-sm text-slate-300">
                <p className="text-xl font-semibold text-white">{teacher.fullName}</p>
                <p>{teacher.specialization} • {teacherStatusLabel[teacher.status]}</p>
                <p>{teacher.phone} • {teacher.email}</p>
                <p>Lương giờ: {formatCurrency(teacher.hourlyRate)}</p>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="font-medium text-white">Ghi chú vận hành</p>
                  <p className="mt-2 leading-6">{teacher.notes || "Chưa có ghi chú"}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-300">Chưa có giáo viên demo.</p>
            )}
          </SectionCard>

          <SectionCard title="Lịch dạy sắp tới" description="Chỉ hiển thị các buổi scheduled thuộc lớp giáo viên đang phụ trách." accent="sky">
            {upcomingSessions.length ? (
              <div className="space-y-3">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-white">{session.courseName}</p>
                      <span className="rounded-full bg-sky-400/10 px-3 py-1 text-sky-200">{session.status}</span>
                    </div>
                    <p className="mt-2">{session.sessionDate} • {session.startTime}-{session.endTime}</p>
                    <p className="mt-1 text-slate-400">Chủ đề: {session.topic}</p>
                    <p className="mt-1 text-slate-500">Điểm danh: {session.attendanceTotal ?? 0} • Vắng: {session.absentCount ?? 0}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-300">Chưa có buổi scheduled nào cho giáo viên demo.</p>
            )}
          </SectionCard>
        </section>

        <section className="grid gap-4 xl:grid-cols-3">
          <SectionCard title="Lớp phụ trách" description="Các lớp có tên giáo viên khớp với hồ sơ demo." accent="violet">
            <div className="mb-4">
              <Link href="/teacher/classes" className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-violet-400/30 hover:text-violet-200">
                Xem chi tiết lớp phụ trách
              </Link>
            </div>
            <div className="space-y-3">
              {assignedCourses.length ? assignedCourses.map((course) => (
                <div key={course.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  <p className="font-semibold text-white">{course.name}</p>
                  <p className="mt-1">{course.level} • Sức chứa {course.capacity}</p>
                  <p className="mt-1 text-slate-400">{course.schedule}</p>
                  <p className="mt-1">Học phí chuẩn: {formatCurrency(course.monthlyFee)}</p>
                </div>
              )) : (
                <p className="text-sm text-slate-300">Chưa có lớp khớp với giáo viên demo.</p>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Điểm danh lớp" description="Khu thao tác nhanh minh hoạ cho buổi học hôm nay; chưa lưu dữ liệu thật." accent="amber">
            <div className="mb-4">
              <Link href="/teacher/attendance" className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-amber-400/30 hover:text-amber-200">
                Mở trang điểm danh
              </Link>
            </div>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-lg font-semibold text-white">{upcomingSessions[0]?.courseName ?? assignedCourses[0]?.name ?? "Chọn lớp"}</p>
                <p className="mt-2">Chuẩn bị danh sách điểm danh, ghi chú vắng/trễ và gửi học vụ xác nhận.</p>
              </div>
              {["Mở điểm danh", "Ghi nhận bài tập", "Gửi nhận xét sau buổi"].map((action) => (
                <button key={action} type="button" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left font-medium text-white transition hover:border-amber-400/30 hover:text-amber-200">
                  {action}
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Nhập đánh giá" description="Các bài đánh giá gần đây của lớp đang phụ trách." accent="rose">
            <div className="mb-4">
              <Link href="/teacher/assessments" className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-rose-400/30 hover:text-rose-200">
                Mở trang đánh giá
              </Link>
            </div>
            <div className="space-y-3">
              {teacherAssessments.length ? teacherAssessments.map((assessment) => (
                <div key={assessment.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold text-white">{assessment.title}</p>
                    <span className="rounded-full bg-rose-400/10 px-3 py-1 text-rose-200">{formatScore(assessment.averageScore)}</span>
                  </div>
                  <p className="mt-2">{assessment.courseName} • {assessment.assessmentDate}</p>
                  <p className="mt-1 text-slate-400">Đã chấm: {assessment.scoreCount ?? 0} bài • Trọng số {assessment.weight}%</p>
                </div>
              )) : (
                <p className="text-sm text-slate-300">Chưa có bài đánh giá cho lớp phụ trách.</p>
              )}
            </div>
          </SectionCard>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <SectionCard title="Danh sách học viên cần lưu ý" description="Danh sách cần phối hợp chăm sóc từ tổng hợp vận hành." accent="sky">
            <div className="grid gap-3 md:grid-cols-2">
              {summary.studentCareList.map((item) => (
                <div key={`${item.studentId}-${item.reason}`} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  <p className="font-semibold text-white">{item.studentName}</p>
                  <p className="mt-2">{item.reason}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-amber-200">{item.severity}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Yêu cầu nhanh" description="Các hành động minh hoạ dành cho giáo viên; chưa ghi nhận dữ liệu thật." accent="emerald">
            <div className="grid gap-3 text-sm">
              {["Đề xuất đổi lịch", "Gửi báo cáo lớp", "Ghi chú học viên", "Yêu cầu học liệu"].map((action) => (
                <button key={action} type="button" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left font-medium text-white transition hover:border-emerald-400/30 hover:text-emerald-200">
                  {action}
                </button>
              ))}
            </div>
          </SectionCard>
        </section>
      </div>
    </main>
  );
}
