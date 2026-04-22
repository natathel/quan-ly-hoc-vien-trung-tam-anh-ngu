import { SectionCard } from "@/components/shared/section-card";
import type { Enrollment } from "@/lib/types";

import { AdminSubpageShell } from "./admin-subpage-shell";
import { formatCurrency, paymentStatusClass, paymentStatusLabel } from "./admin-portal-utils";

type AdminEnrollmentsPageProps = {
  enrollments: Enrollment[];
};

export function AdminEnrollmentsPage({ enrollments }: AdminEnrollmentsPageProps) {
  const paidCount = enrollments.filter((item) => item.paymentStatus === "paid").length;
  const partialCount = enrollments.filter((item) => item.paymentStatus === "partial").length;
  const unpaidCount = enrollments.filter((item) => item.paymentStatus === "unpaid").length;
  const expectedMonthlyFee = enrollments.reduce((sum, item) => sum + (item.monthlyFee ?? 0), 0);

  return (
    <AdminSubpageShell
      activeHref="/admin/enrollments"
      title="Quản lý ghi danh"
      description="Theo dõi từng ghi danh theo khóa học, ngày bắt đầu, giáo viên phụ trách và trạng thái thanh toán hiện tại."
    >
      <section className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Tổng ghi danh", value: enrollments.length, accent: "text-sky-300" },
          { label: "Đã thu đủ", value: paidCount, accent: "text-emerald-300" },
          { label: "Thu một phần", value: partialCount, accent: "text-amber-300" },
          { label: "Chưa thanh toán", value: unpaidCount, accent: "text-rose-300" },
        ].map((item) => (
          <article key={item.label} className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/30">
            <p className="text-sm text-slate-400">{item.label}</p>
            <p className={`mt-3 text-3xl font-semibold ${item.accent}`}>{item.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title="Danh sách ghi danh" description="Danh sách lấy trực tiếp từ listEnrollments, không chỉnh sửa dữ liệu." accent="amber">
          <div className="space-y-3">
            {enrollments.map((enrollment) => (
              <article key={enrollment.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-white">{enrollment.studentName}</p>
                    <p className="mt-1">{enrollment.courseName} • {enrollment.level}</p>
                    <p className="mt-1 text-slate-400">Giáo viên: {enrollment.teacher}</p>
                    <p className="mt-1 text-slate-400">Bắt đầu: {enrollment.startDate}{enrollment.endDate ? ` • Kết thúc: ${enrollment.endDate}` : ""}</p>
                  </div>
                  <div className="min-w-56 rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${paymentStatusClass[enrollment.paymentStatus]}`}>
                      {paymentStatusLabel[enrollment.paymentStatus]}
                    </span>
                    <p className="mt-3">Học phí tháng: <span className="font-semibold text-white">{formatCurrency(enrollment.monthlyFee ?? 0)}</span></p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Theo dõi thu phí" description="Góc nhìn nhanh để đội admin chốt công nợ theo ghi danh." accent="rose">
          <div className="space-y-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-slate-400">Doanh thu chuẩn theo ghi danh</p>
              <p className="mt-2 text-2xl font-semibold text-white">{formatCurrency(expectedMonthlyFee)}</p>
            </div>
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-rose-100">
              <p>Cần theo dõi ngay</p>
              <p className="mt-2 text-2xl font-semibold">{partialCount + unpaidCount} hồ sơ</p>
            </div>
            <button type="button" className="w-full rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-left text-amber-100 transition hover:border-amber-300/40">
              Nhắc thu học phí minh hoạ
            </button>
          </div>
        </SectionCard>
      </section>
    </AdminSubpageShell>
  );
}
