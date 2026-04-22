import { SectionCard } from "@/components/shared/section-card";
import type { Invoice, Payment } from "@/lib/types";

import { AdminSubpageShell } from "./admin-subpage-shell";
import {
  formatCurrency,
  getInvoiceOutstanding,
  getInvoicePaymentCount,
  invoiceStatusClass,
  invoiceStatusLabel,
} from "./admin-portal-utils";

type AdminInvoicesPageProps = {
  invoices: Invoice[];
  payments: Payment[];
};

export function AdminInvoicesPage({ invoices, payments }: AdminInvoicesPageProps) {
  const openInvoices = invoices.filter((invoice) => !["paid", "void"].includes(invoice.status));
  const outstandingTuition = openInvoices.reduce((sum, invoice) => sum + getInvoiceOutstanding(invoice), 0);
  const collectedTuition = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const overdueInvoices = invoices.filter((invoice) => invoice.status === "overdue").length;

  return (
    <AdminSubpageShell
      activeHref="/admin/invoices"
      title="Hóa đơn và công nợ học phí"
      description="Theo dõi hóa đơn mở, số tiền đã thu, số tiền còn phải thu và trạng thái chứng từ theo từng học viên."
    >
      <section className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Tổng hóa đơn", value: invoices.length, accent: "text-sky-300" },
          { label: "Hóa đơn mở", value: openInvoices.length, accent: "text-amber-300" },
          { label: "Quá hạn", value: overdueInvoices, accent: "text-rose-300" },
          { label: "Đã thu", value: formatCurrency(collectedTuition), accent: "text-emerald-300" },
        ].map((item) => (
          <article key={item.label} className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/30">
            <p className="text-sm text-slate-400">{item.label}</p>
            <p className={`mt-3 text-3xl font-semibold ${item.accent}`}>{item.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <SectionCard title="Hóa đơn đang theo dõi" description="Hiển thị toàn bộ hóa đơn và ưu tiên nhận diện công nợ còn mở." accent="rose">
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-300">
              <thead className="bg-white/5 text-slate-300">
                <tr>
                  <th className="px-4 py-3 font-medium">Mã hóa đơn</th>
                  <th className="px-4 py-3 font-medium">Học viên</th>
                  <th className="px-4 py-3 font-medium">Hạn thanh toán</th>
                  <th className="px-4 py-3 font-medium">Còn phải thu</th>
                  <th className="px-4 py-3 font-medium">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-slate-950/40">
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-4 py-4 align-top">
                      <p className="font-semibold text-white">{invoice.invoiceNo}</p>
                      <p className="mt-1 text-xs text-slate-400">Ngày phát hành: {invoice.issueDate}</p>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <p>{invoice.studentName}</p>
                      <p className="mt-1 text-xs text-slate-400">{invoice.courseName || "Không gắn lớp"}</p>
                    </td>
                    <td className="px-4 py-4 align-top">{invoice.dueDate}</td>
                    <td className="px-4 py-4 align-top">
                      <p className="font-semibold text-white">{formatCurrency(getInvoiceOutstanding(invoice))}</p>
                      <p className="mt-1 text-xs text-slate-400">{getInvoicePaymentCount(invoice.id, payments)} lần thanh toán</p>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${invoiceStatusClass[invoice.status]}`}>
                        {invoiceStatusLabel[invoice.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="Công nợ mở" description="Tổng hợp phần chưa thu của các hóa đơn chưa hoàn tất." accent="amber">
          <div className="space-y-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-rose-100">
              <p>Còn phải thu</p>
              <p className="mt-2 text-2xl font-semibold">{formatCurrency(outstandingTuition)}</p>
            </div>
            {openInvoices.slice(0, 4).map((invoice) => (
              <article key={invoice.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white">{invoice.studentName}</p>
                <p className="mt-1 text-slate-400">{invoice.invoiceNo} • hạn {invoice.dueDate}</p>
                <p className="mt-2 text-amber-200">{formatCurrency(getInvoiceOutstanding(invoice))}</p>
              </article>
            ))}
            <button type="button" className="w-full rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-left text-rose-100 transition hover:border-rose-300/40">
              Lên lịch nhắc công nợ minh hoạ
            </button>
          </div>
        </SectionCard>
      </section>
    </AdminSubpageShell>
  );
}
