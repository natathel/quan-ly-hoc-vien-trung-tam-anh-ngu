import { SectionCard } from "@/components/shared/section-card";
import type { Course, Enrollment, Session } from "@/lib/types";

import { AdminSubpageShell } from "./admin-subpage-shell";
import { formatCurrency, formatPercent, getCourseEnrollmentCount } from "./admin-portal-utils";

type AdminCoursesPageProps = {
  courses: Course[];
  enrollments: Enrollment[];
  sessions: Session[];
};

export function AdminCoursesPage({ courses, enrollments, sessions }: AdminCoursesPageProps) {
  const totalCapacity = courses.reduce((sum, course) => sum + course.capacity, 0);
  const activeSeats = courses.reduce((sum, course) => sum + getCourseEnrollmentCount(course.id, enrollments), 0);
  const averageCapacityUsage = totalCapacity ? Math.round((activeSeats / totalCapacity) * 100) : 0;

  return (
    <AdminSubpageShell
      activeHref="/admin/courses"
      title="Khoá học, sức chứa và lịch học"
      description="Theo dõi từng lớp/khoá đang vận hành, lịch học, giáo viên phụ trách, tỷ lệ lấp đầy và số buổi đã lên lịch."
    >
      <section className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Tổng khóa học", value: courses.length, accent: "text-sky-300" },
          { label: "Sĩ số hiện tại", value: activeSeats, accent: "text-emerald-300" },
          { label: "Tổng sức chứa", value: totalCapacity, accent: "text-violet-300" },
          { label: "Công suất", value: formatPercent(averageCapacityUsage), accent: "text-amber-300" },
        ].map((item) => (
          <article key={item.label} className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/30">
            <p className="text-sm text-slate-400">{item.label}</p>
            <p className={`mt-3 text-3xl font-semibold ${item.accent}`}>{item.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title="Danh sách khóa học" description="Công suất được tính từ ghi danh chưa có ngày kết thúc." accent="violet">
          <div className="grid gap-3">
            {courses.map((course) => {
              const seatCount = getCourseEnrollmentCount(course.id, enrollments);
              const usage = course.capacity ? Math.round((seatCount / course.capacity) * 100) : 0;
              const courseSessions = sessions.filter((session) => session.courseId === course.id);
              const upcomingSessions = courseSessions.filter((session) => session.status === "scheduled").length;

              return (
                <article key={course.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-white">{course.name}</p>
                      <p className="mt-1">{course.level} • {course.teacher}</p>
                      <p className="mt-1 text-slate-400">Lịch học: {course.schedule}</p>
                      <p className="mt-1 text-slate-400">Học phí chuẩn: {formatCurrency(course.monthlyFee)}</p>
                    </div>
                    <div className="min-w-56 rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                      <p>Sĩ số: <span className="font-semibold text-white">{seatCount}/{course.capacity}</span></p>
                      <p className="mt-1">Tỷ lệ lấp đầy: <span className="font-semibold text-emerald-200">{formatPercent(usage)}</span></p>
                      <p className="mt-1">Buổi sắp tới: <span className="font-semibold text-sky-200">{upcomingSessions}</span></p>
                    </div>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full rounded-full bg-sky-400" style={{ width: `${Math.min(usage, 100)}%` }} />
                  </div>
                </article>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Lịch vận hành gần nhất" description="Các buổi học sắp diễn ra được lấy từ listSessions." accent="sky">
          <div className="space-y-3 text-sm text-slate-300">
            {sessions.filter((session) => session.status === "scheduled").slice(0, 6).map((session) => (
              <article key={session.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white">{session.courseName ?? `Lớp #${session.courseId}`}</p>
                <p className="mt-2">{session.sessionDate} • {session.startTime}-{session.endTime}</p>
                <p className="mt-1 text-slate-400">Chủ đề: {session.topic}</p>
                <p className="mt-1 text-slate-400">Giáo viên: {session.teacherName ?? "Đang cập nhật"}</p>
              </article>
            ))}
            <button type="button" className="w-full rounded-2xl border border-sky-400/20 bg-sky-400/10 px-4 py-3 text-left text-sky-100 transition hover:border-sky-300/40">
              Lập kế hoạch mở lớp minh hoạ
            </button>
          </div>
        </SectionCard>
      </section>
    </AdminSubpageShell>
  );
}
