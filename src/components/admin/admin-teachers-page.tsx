import { SectionCard } from "@/components/shared/section-card";
import type { Course, Enrollment, Teacher } from "@/lib/types";

import { AdminSubpageShell } from "./admin-subpage-shell";
import {
  formatCurrency,
  getTeacherCourseCount,
  getTeacherMonthlyLoad,
  getTeacherStudentCount,
  teacherStatusClass,
  teacherStatusLabel,
} from "./admin-portal-utils";

type AdminTeachersPageProps = {
  teachers: Teacher[];
  courses: Course[];
  enrollments: Enrollment[];
};

export function AdminTeachersPage({ teachers, courses, enrollments }: AdminTeachersPageProps) {
  const activeTeachers = teachers.filter((teacher) => teacher.status === "active").length;
  const totalHourlyBudget = teachers.reduce((sum, teacher) => sum + teacher.hourlyRate, 0);

  return (
    <AdminSubpageShell
      activeHref="/admin/teachers"
      title="Điều phối giáo viên"
      description="Theo dõi đội ngũ giảng dạy, số lớp đang phụ trách, quy mô học viên và tải doanh thu tương ứng của từng giáo viên."
    >
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Giáo viên active", value: activeTeachers, accent: "text-emerald-300" },
          { label: "Tổng giáo viên", value: teachers.length, accent: "text-sky-300" },
          { label: "Ngân sách lương giờ", value: formatCurrency(totalHourlyBudget), accent: "text-amber-300" },
        ].map((item) => (
          <article key={item.label} className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/30">
            <p className="text-sm text-slate-400">{item.label}</p>
            <p className={`mt-3 text-3xl font-semibold ${item.accent}`}>{item.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionCard title="Danh sách giáo viên" description="Kết hợp dữ liệu giáo viên, khóa học và ghi danh để hiển thị khối lượng giảng dạy hiện tại." accent="emerald">
          <div className="space-y-3">
            {teachers.map((teacher) => {
              const courseCount = getTeacherCourseCount(teacher.fullName, courses);
              const studentCount = getTeacherStudentCount(teacher.fullName, courses, enrollments);
              const monthlyLoad = getTeacherMonthlyLoad(teacher.fullName, courses, enrollments);

              return (
                <article key={teacher.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-white">{teacher.fullName}</p>
                      <p className="mt-1 text-slate-400">{teacher.specialization}</p>
                      <p className="mt-1 text-xs text-slate-500">{teacher.phone} • {teacher.email}</p>
                    </div>
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${teacherStatusClass[teacher.status]}`}>
                      {teacherStatusLabel[teacher.status]}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Số lớp</p>
                      <p className="mt-2 text-xl font-semibold text-white">{courseCount}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Học viên phụ trách</p>
                      <p className="mt-2 text-xl font-semibold text-white">{studentCount}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Doanh thu lớp phụ trách</p>
                      <p className="mt-2 text-xl font-semibold text-white">{formatCurrency(monthlyLoad)}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-slate-400">Ghi chú: {teacher.notes || "Chưa có ghi chú."}</p>
                </article>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Tổng quan phân công" description="Các chỉ số giúp admin cân đối lịch dạy và chuyên môn." accent="violet">
          <div className="space-y-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-slate-400">Giáo viên đang nghỉ phép</p>
              <p className="mt-2 text-2xl font-semibold text-amber-200">
                {teachers.filter((teacher) => teacher.status === "on_leave").length}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-slate-400">Khóa học đã gán giáo viên</p>
              <p className="mt-2 text-2xl font-semibold text-sky-200">{courses.length}</p>
            </div>
            <button type="button" className="w-full rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-left text-emerald-100 transition hover:border-emerald-300/40">
              Điều phối lịch dạy minh hoạ
            </button>
            <button type="button" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:border-violet-400/30 hover:text-violet-200">
              Chuẩn bị thay thế giảng viên
            </button>
          </div>
        </SectionCard>
      </section>
    </AdminSubpageShell>
  );
}
