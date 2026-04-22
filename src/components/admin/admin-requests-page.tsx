import Link from "next/link";

import { SectionCard } from "@/components/shared/section-card";
import type { StudentRequest } from "@/lib/types";

import { AdminSubpageShell } from "./admin-subpage-shell";

const requestStatusOrder = ["open", "in_progress", "resolved", "closed"] as const;
const requestTypeOrder = ["class_transfer", "schedule_change", "tuition", "academic", "support"] as const;

const requestStatusLabel: Record<StudentRequest["status"], string> = {
  open: "Mới tạo",
  in_progress: "Đang xử lý",
  resolved: "Đã giải quyết",
  closed: "Đóng ticket",
};

const requestStatusClass: Record<StudentRequest["status"], string> = {
  open: "border-rose-500/20 bg-rose-500/10 text-rose-200",
  in_progress: "border-amber-500/20 bg-amber-500/10 text-amber-200",
  resolved: "border-emerald-500/20 bg-emerald-500/10 text-emerald-200",
  closed: "border-slate-500/20 bg-slate-500/10 text-slate-300",
};

const requestTypeLabel: Record<StudentRequest["requestType"], string> = {
  class_transfer: "Chuyển lớp",
  schedule_change: "Đổi lịch học",
  tuition: "Học phí",
  academic: "Học vụ",
  support: "Hỗ trợ chung",
};

const requestTypeClass: Record<StudentRequest["requestType"], string> = {
  class_transfer: "border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-200",
  schedule_change: "border-sky-500/20 bg-sky-500/10 text-sky-200",
  tuition: "border-amber-500/20 bg-amber-500/10 text-amber-200",
  academic: "border-emerald-500/20 bg-emerald-500/10 text-emerald-200",
  support: "border-violet-500/20 bg-violet-500/10 text-violet-200",
};

function groupRequestsByStatus(requests: StudentRequest[]) {
  return new Map(requestStatusOrder.map((status) => [status, requests.filter((request) => request.status === status)]));
}

function groupRequestsByType(requests: StudentRequest[]) {
  return new Map(requestTypeOrder.map((type) => [type, requests.filter((request) => request.requestType === type)]));
}

type AdminRequestsPageProps = {
  requests: StudentRequest[];
};

export function AdminRequestsPage({ requests }: AdminRequestsPageProps) {
  const groupedByStatus = groupRequestsByStatus(requests);
  const groupedByType = groupRequestsByType(requests);
  const openQueue = requests.filter((request) => request.status === "open" || request.status === "in_progress");
  const resolvedRate = requests.length
    ? Math.round((requests.filter((request) => request.status === "resolved" || request.status === "closed").length / requests.length) * 100)
    : 0;

  return (
    <AdminSubpageShell
      activeHref="/admin/requests"
      title="Điều phối yêu cầu học viên"
      description="Bảng điều hành student requests đọc từ SQLite để admin theo dõi queue hỗ trợ, phân loại ticket và hoàn thiện luồng chăm sóc end-to-end."
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Tổng ticket", value: requests.length, accent: "text-sky-300" },
          { label: "Đang chờ xử lý", value: groupedByStatus.get("open")?.length ?? 0, accent: "text-rose-300" },
          { label: "Đang theo dõi", value: groupedByStatus.get("in_progress")?.length ?? 0, accent: "text-amber-300" },
          { label: "Tỷ lệ hoàn tất", value: `${resolvedRate}%`, accent: "text-emerald-300" },
        ].map((item) => (
          <article key={item.label} className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/30">
            <p className="text-sm text-slate-400">{item.label}</p>
            <p className={`mt-3 text-3xl font-semibold ${item.accent}`}>{item.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard title="Workflow theo trạng thái" description="Nhóm ticket theo vòng đời xử lý để admin/học vụ dễ ưu tiên queue trong ngày." accent="sky">
          <div className="grid gap-4 xl:grid-cols-4">
            {requestStatusOrder.map((status) => (
              <div key={status} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${requestStatusClass[status]}`}>
                    {requestStatusLabel[status]}
                  </span>
                  <span className="text-xs text-slate-400">{groupedByStatus.get(status)?.length ?? 0} ticket</span>
                </div>

                <div className="space-y-3">
                  {(groupedByStatus.get(status) ?? []).map((request) => (
                    <article key={request.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <p className="font-semibold text-white">{request.title}</p>
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${requestTypeClass[request.requestType]}`}>
                          {requestTypeLabel[request.requestType]}
                        </span>
                      </div>
                      <p className="mt-2">{request.studentName}</p>
                      <p className="mt-2 text-slate-400">{request.description}</p>
                      <p className="mt-3 text-xs text-slate-500">Tạo lúc {request.createdAt}</p>
                      {request.response ? <p className="mt-3 rounded-2xl border border-white/10 bg-slate-950/60 p-3 text-slate-300">Phản hồi: {request.response}</p> : null}
                    </article>
                  ))}

                  {!(groupedByStatus.get(status)?.length) ? (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-400">
                      Chưa có ticket ở trạng thái này.
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="grid gap-4">
          <SectionCard title="Phân loại theo nhu cầu" description="Cho phép nhìn nhanh nguồn lực cần phối hợp giữa học vụ, giáo vụ và tài chính." accent="violet">
            <div className="space-y-3">
              {requestTypeOrder.map((type) => (
                <article key={type} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  <div className="flex items-center justify-between gap-3">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${requestTypeClass[type]}`}>
                      {requestTypeLabel[type]}
                    </span>
                    <span className="text-sm font-semibold text-white">{groupedByType.get(type)?.length ?? 0}</span>
                  </div>
                </article>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Hàng đợi ưu tiên hôm nay" description="Các request open/in-progress nên được xử lý trước để tránh phát sinh escalations từ phụ huynh." accent="amber">
            <div className="space-y-3 text-sm text-slate-300">
              {openQueue.length ? (
                openQueue.slice(0, 5).map((request) => (
                  <article key={request.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-semibold text-white">{request.studentName}</p>
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${requestStatusClass[request.status]}`}>
                        {requestStatusLabel[request.status]}
                      </span>
                    </div>
                    <p className="mt-2">{request.title}</p>
                    <p className="mt-1 text-slate-400">{requestTypeLabel[request.requestType]} • {request.createdAt}</p>
                  </article>
                ))
              ) : (
                <p className="text-sm text-slate-300">Không còn ticket ưu tiên mở trong hệ thống demo.</p>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Liên kết vận hành" description="Giữ luồng từ portal học viên sang admin và thông báo nội bộ nhất quán với pattern hiện có." accent="emerald">
            <div className="space-y-3 text-sm text-slate-300">
              <Link href="/student/requests" className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-sky-400/30 hover:text-sky-200">
                Mở giao diện học viên để xem luồng gửi request
              </Link>
              <Link href="/admin/notifications" className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-emerald-400/30 hover:text-emerald-200">
                Điều phối thông báo song song với queue hỗ trợ
              </Link>
            </div>
          </SectionCard>
        </div>
      </section>
    </AdminSubpageShell>
  );
}
