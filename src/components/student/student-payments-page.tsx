import { SectionCard } from "@/components/shared/section-card";
import type { Enrollment, Invoice, Payment, Student } from "@/lib/types";

import {
  formatCurrency,
  getCurrentStudentContext,
  getStudentInvoices,
  invoiceLabel,
  paymentMethodLabel,
  studentStatusLabel,
} from "./student-portal-utils";
import { StudentSubpageShell } from "./student-subpage-shell";

type StudentPaymentsPageProps = {
  students: Student[];
  enrollments: Enrollment[];
  invoices: Invoice[];
  payments: Payment[];
};

export function StudentPaymentsPage({
  students,
  enrollments,
  invoices,
  payments,
}: StudentPaymentsPageProps) {
  const { student, currentEnrollment } = getCurrentStudentContext({ students, enrollments });
  const studentInvoices = getStudentInvoices({ student, invoices }).sort((a, b) => b.dueDate.localeCompare(a.dueDate));
  const paymentsByInvoice = new Map<number, Payment[]>(
    studentInvoices.map((invoice) => [
      invoice.id,
      payments.filter((payment) => payment.invoiceId === invoice.id).sort((a, b) => b.paymentDate.localeCompare(a.paymentDate)),
    ]),
  );

  const totalInvoiced = studentInvoices.reduce((sum, invoice) => sum + invoice.amount - invoice.discount, 0);
  const totalPaid = studentInvoices.reduce((sum, invoice) => sum + (invoice.paidAmount ?? 0), 0);
  const totalOutstanding = studentInvoices.reduce((sum, invoice) => sum + (invoice.outstandingAmount ?? 0), 0);

  return (
    <StudentSubpageShell
      activeHref="/student/payments"
      title={student ? `Thanh toán & công nợ của ${student.fullName}` : "Thanh toán học viên"}
      description="Hiển thị hóa đơn, tình trạng thanh toán, số dư còn thiếu và lịch sử thu tiền của học viên demo. Các nút thao tác chỉ mang tính minh hoạ giao diện."
    >
      <section className="grid gap-4 xl:grid-cols-3">
        <SectionCard title="Thông tin thanh toán" description="Ngữ cảnh học viên và lớp hiện tại." accent="sky">
          {student ? (
            <div className="space-y-3 text-sm text-slate-300">
              <p className="text-xl font-semibold text-white">{student.fullName}</p>
              <p>{student.level} • {studentStatusLabel[student.status]}</p>
              <p>Lớp hiện tại: {currentEnrollment?.courseName ?? "Chưa xác định"}</p>
              <p>Phụ huynh: {student.guardianName || "Chưa cập nhật"}</p>
            </div>
          ) : (
            <p className="text-sm text-slate-300">Chưa có học viên demo.</p>
          )}
        </SectionCard>

        <SectionCard title="Tổng quan công nợ" description="Các chỉ số tổng hợp theo toàn bộ hóa đơn của học viên." accent="emerald">
          <div className="grid gap-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Tổng phải thu</p>
              <p className="mt-2 text-2xl font-semibold text-white">{formatCurrency(totalInvoiced)}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Đã thanh toán</p>
              <p className="mt-2 text-2xl font-semibold text-white">{formatCurrency(totalPaid)}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Còn outstanding</p>
              <p className="mt-2 text-2xl font-semibold text-rose-200">{formatCurrency(totalOutstanding)}</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Thao tác nhanh" description="UI-only, chưa có API xử lý ở phase này." accent="rose">
          <div className="grid gap-3 text-sm">
            {[
              {
                title: "Xem hướng dẫn chuyển khoản",
                description: "Mở thông tin tài khoản trung tâm và cú pháp thanh toán.",
              },
              {
                title: "Yêu cầu gửi lại hóa đơn",
                description: "Tạo yêu cầu gửi lại PDF hoặc ảnh hóa đơn qua email/Zalo trong phase sau.",
              },
              {
                title: "Liên hệ bộ phận thu ngân",
                description: "Trao đổi về đối soát, công nợ hoặc mốc thanh toán kế tiếp.",
              },
            ].map((action) => (
              <button
                key={action.title}
                type="button"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left transition hover:border-sky-400/30 hover:text-sky-200"
              >
                <p className="font-medium text-white">{action.title}</p>
                <p className="mt-1 text-slate-400">{action.description}</p>
              </button>
            ))}
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard title="Danh sách hóa đơn" description="Chi tiết trạng thái, hạn thanh toán, số đã thu và số còn thiếu theo từng chứng từ." accent="amber">
          {studentInvoices.length ? (
            <div className="space-y-3">
              {studentInvoices.map((invoice) => (
                <div key={invoice.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-white">{invoice.invoiceNo}</p>
                        <span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs text-amber-200">{invoiceLabel[invoice.status]}</span>
                      </div>
                      <p className="mt-2">Khóa học: {invoice.courseName ?? currentEnrollment?.courseName ?? "Chưa gắn lớp"}</p>
                      <p className="mt-1">Phát hành: {invoice.issueDate} • Đến hạn: {invoice.dueDate}</p>
                      <p className="mt-1 text-slate-400">{invoice.description}</p>
                    </div>
                    <div className="min-w-52 rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                      <p>Tổng tiền: <span className="font-semibold text-white">{formatCurrency(invoice.amount - invoice.discount)}</span></p>
                      <p className="mt-1">Đã thu: <span className="font-semibold text-emerald-300">{formatCurrency(invoice.paidAmount ?? 0)}</span></p>
                      <p className="mt-1">Còn thiếu: <span className="font-semibold text-rose-200">{formatCurrency(invoice.outstandingAmount ?? 0)}</span></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-300">Không có hóa đơn nào cho học viên demo.</p>
          )}
        </SectionCard>

        <SectionCard title="Lịch sử thanh toán" description="Gom nhóm payment theo hóa đơn để phụ huynh tiện đối chiếu." accent="violet">
          {studentInvoices.length ? (
            <div className="space-y-4">
              {studentInvoices.map((invoice) => {
                const invoicePayments = paymentsByInvoice.get(invoice.id) ?? [];

                return (
                  <div key={invoice.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-white">{invoice.invoiceNo}</p>
                      <span className="text-xs text-slate-400">{invoicePayments.length} giao dịch</span>
                    </div>
                    {invoicePayments.length ? (
                      <div className="mt-3 space-y-3">
                        {invoicePayments.map((payment) => (
                          <div key={payment.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-medium text-white">{formatCurrency(payment.amount)}</p>
                                <p className="mt-1">{payment.paymentDate} • {paymentMethodLabel[payment.method]}</p>
                              </div>
                              <div className="text-right text-xs text-slate-400">
                                <p>{payment.referenceNo || "Không có mã ref"}</p>
                              </div>
                            </div>
                            <p className="mt-2 text-slate-400">{payment.note || "Không có ghi chú"}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 text-slate-400">Chưa ghi nhận thanh toán cho hóa đơn này.</p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-300">Chưa có lịch sử thanh toán để hiển thị.</p>
          )}
        </SectionCard>
      </section>
    </StudentSubpageShell>
  );
}
