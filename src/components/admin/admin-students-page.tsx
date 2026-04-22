import { SectionCard } from "@/components/shared/section-card";
import type { Enrollment, Student } from "@/lib/types";

import { AdminSubpageShell } from "./admin-subpage-shell";
import { getStudentEnrollmentSummary, studentStatusClass, studentStatusLabel } from "./admin-portal-utils";

type AdminStudentsPageProps = {
  students: Student[];
  enrollments: Enrollment[];
};

export function AdminStudentsPage({ students, enrollments }: AdminStudentsPageProps) {
  const activeStudents = students.filter((student) => student.status === "active").length;
  const pausedStudents = students.filter((student) => student.status === "paused").length;
  const studentsNeedingPaymentFollowUp = students.filter(
    (student) => getStudentEnrollmentSummary(student.id, enrollments).unpaid > 0,
  ).length;

  return (
    <AdminSubpageShell
      activeHref="/admin/students"
      title="Quản lý học viên"
      description="Danh sách hồ sơ học viên, thông tin phụ huynh, mục tiêu học tập và tóm tắt vận hành theo ghi danh hiện có."
    >
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Tổng hồ sơ", value: students.length, accent: "text-sky-300" },
          { label: "Đang học", value: activeStudents, accent: "text-emerald-300" },
          { label: "Cần theo dõi học phí", value: studentsNeedingPaymentFollowUp, accent: "text-rose-300" },
        ].map((item) => (
          <article key={item.label} className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/30">
            <p className="text-sm text-slate-400">{item.label}</p>
            <p className={`mt-3 text-3xl font-semibold ${item.accent}`}>{item.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <SectionCard title="Danh sách học viên" description="Dữ liệu đọc từ hàm listStudents và đối chiếu listEnrollments để hiển thị tình trạng lớp/học phí." accent="sky">
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-300">
              <thead className="bg-white/5 text-slate-300">
                <tr>
                  <th className="px-4 py-3 font-medium">Học viên</th>
                  <th className="px-4 py-3 font-medium">Phụ huynh</th>
                  <th className="px-4 py-3 font-medium">Ghi danh</th>
                  <th className="px-4 py-3 font-medium">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-slate-950/40">
                {students.map((student) => {
                  const summary = getStudentEnrollmentSummary(student.id, enrollments);

                  return (
                    <tr key={student.id}>
                      <td className="px-4 py-4 align-top">
                        <p className="font-semibold text-white">{student.fullName}</p>
                        <p className="mt-1 text-xs text-slate-400">{student.level} • Nhập học {student.enrollmentDate}</p>
                        <p className="mt-1 text-xs text-slate-500">{student.phone} • {student.email}</p>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <p>{student.guardianName || "Chưa cập nhật"}</p>
                        <p className="mt-1 text-xs text-slate-400">{student.guardianPhone || "Chưa cập nhật số"}</p>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <p>{summary.active} lớp đang học / {summary.total} ghi danh</p>
                        <p className="mt-1 text-xs text-slate-400">{summary.unpaid} ghi danh chưa thu đủ</p>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${studentStatusClass[student.status]}`}>
                          {studentStatusLabel[student.status]}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="Tóm tắt vận hành" description="Các thẻ này giúp admin ưu tiên chăm sóc học vụ và học phí." accent="emerald">
          <div className="space-y-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-slate-400">Học viên tạm nghỉ</p>
              <p className="mt-2 text-2xl font-semibold text-amber-200">{pausedStudents}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-slate-400">Tỷ lệ đang học</p>
              <p className="mt-2 text-2xl font-semibold text-emerald-200">
                {students.length ? Math.round((activeStudents / students.length) * 100) : 0}%
              </p>
            </div>
            <button type="button" className="w-full rounded-2xl border border-sky-400/20 bg-sky-400/10 px-4 py-3 text-left text-sky-100 transition hover:border-sky-300/40">
              Chuẩn bị thêm học viên mới
            </button>
            <button type="button" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:border-emerald-400/30 hover:text-emerald-200">
              Xuất danh sách chăm sóc minh hoạ
            </button>
          </div>
        </SectionCard>
      </section>
    </AdminSubpageShell>
  );
}
