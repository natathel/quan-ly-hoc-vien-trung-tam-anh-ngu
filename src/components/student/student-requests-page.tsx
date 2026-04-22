import { SectionCard } from "@/components/shared/section-card";
import type { Notification, Student, StudentRequest } from "@/lib/types";

import { StudentSubpageShell } from "./student-subpage-shell";

const requestStatusLabel: Record<StudentRequest["status"], string> = {
  open: "Mới gửi",
  in_progress: "Đang xử lý",
  resolved: "Đã phản hồi",
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

const notificationPriorityLabel: Record<Notification["priority"], string> = {
  normal: "Thông tin",
  high: "Ưu tiên cao",
  critical: "Khẩn",
};

const notificationPriorityClass: Record<Notification["priority"], string> = {
  normal: "border-sky-500/20 bg-sky-500/10 text-sky-100",
  high: "border-amber-500/20 bg-amber-500/10 text-amber-100",
  critical: "border-rose-500/20 bg-rose-500/10 text-rose-100",
};

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function isStudentVisibleNotification(notification: Notification, today = todayIso()) {
  return (notification.audience === "all" || notification.audience === "students")
    && notification.publishedAt <= today
    && (!notification.expiresAt || notification.expiresAt >= today);
}

const requestTemplates = [
  {
    title: "Xin đổi buổi học",
    type: "schedule_change",
    description: "Phù hợp khi học viên cần học bù, xin nghỉ có phép hoặc đổi khung giờ trong tuần.",
  },
  {
    title: "Đề xuất chuyển lớp",
    type: "class_transfer",
    description: "Dành cho nhu cầu đổi trình độ, đổi giáo viên hoặc chuyển lịch sang lớp khác.",
  },
  {
    title: "Trao đổi học phí",
    type: "tuition",
    description: "Dùng khi cần hỏi công nợ, hóa đơn, bảo lưu học phí hoặc xác nhận thanh toán.",
  },
  {
    title: "Hỗ trợ học vụ",
    type: "academic",
    description: "Dùng để hỏi lộ trình học, báo cáo tiến độ, bài tập hoặc đánh giá đầu ra.",
  },
] as const satisfies Array<{
  title: string;
  type: StudentRequest["requestType"];
  description: string;
}>;

type StudentRequestsPageProps = {
  students: Student[];
  requests: StudentRequest[];
  notifications: Notification[];
};

export function StudentRequestsPage({ students, requests, notifications }: StudentRequestsPageProps) {
  const student = students[0];
  const myRequests = student ? requests.filter((request) => request.studentId === student.id) : [];
  const visibleNotifications = notifications.filter((notification) => isStudentVisibleNotification(notification));
  const activeRequests = myRequests.filter((request) => request.status === "open" || request.status === "in_progress").length;
  const resolvedRequests = myRequests.filter((request) => request.status === "resolved" || request.status === "closed").length;

  return (
    <StudentSubpageShell
      activeHref="/student/requests"
      title="Yêu cầu hỗ trợ & thông báo"
      description="Trang theo dõi ticket của học viên demo, đồng thời hiển thị thông báo dành cho phụ huynh/học viên để luồng hỗ trợ vận hành end-to-end."
    >
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Yêu cầu của tôi", value: myRequests.length, accent: "text-sky-300" },
          { label: "Đang xử lý", value: activeRequests, accent: "text-amber-300" },
          { label: "Đã phản hồi", value: resolvedRequests, accent: "text-emerald-300" },
        ].map((item) => (
          <article key={item.label} className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/30">
            <p className="text-sm text-slate-400">{item.label}</p>
            <p className={`mt-3 text-3xl font-semibold ${item.accent}`}>{item.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="grid gap-4">
          <SectionCard title="Gửi nhanh yêu cầu" description="Các nhóm nhu cầu phổ biến; học viên có thể gửi trực tiếp qua API để admin tiếp nhận trong queue." accent="rose">
            <div className="space-y-3">
              {requestTemplates.map((template) => (
                <article key={template.title} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-semibold text-white">{template.title}</p>
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${requestTypeClass[template.type]}`}>
                      {requestTypeLabel[template.type]}
                    </span>
                  </div>
                  <p className="mt-2 leading-6">{template.description}</p>
                  {student ? (
                    <form action="/api/student-requests" method="post" className="mt-3 grid gap-2">
                      <input type="hidden" name="studentId" value={student.id} />
                      <input type="hidden" name="requestType" value={template.type} />
                      <input type="hidden" name="title" value={template.title} />
                      <input type="hidden" name="description" value={template.description} />
                      <input type="hidden" name="returnTo" value="/student/requests?submitted=1" />
                      <button type="submit" className="rounded-full border border-rose-400/20 bg-rose-400/10 px-4 py-2 text-left text-sm font-medium text-rose-100 transition hover:border-rose-300/40 hover:text-white">
                        Gửi yêu cầu mẫu cho admin
                      </button>
                    </form>
                  ) : null}
                </article>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Thông báo liên quan" description="Danh sách announcement audience students/all đang được chia sẻ cho phụ huynh và học viên." accent="violet">
            <div className="space-y-3">
              {visibleNotifications.length ? (
                visibleNotifications.map((notification) => (
                  <article key={notification.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <p className="font-semibold text-white">{notification.title}</p>
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${notificationPriorityClass[notification.priority]}`}>
                        {notificationPriorityLabel[notification.priority]}
                      </span>
                    </div>
                    <p className="mt-2 leading-6">{notification.message}</p>
                    <p className="mt-3 text-xs text-slate-500">
                      Hiệu lực từ {notification.publishedAt}
                      {notification.expiresAt ? ` • hết hạn ${notification.expiresAt}` : " • đang áp dụng"}
                    </p>
                  </article>
                ))
              ) : (
                <p className="text-sm text-slate-300">Hiện chưa có thông báo dành cho học viên.</p>
              )}
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Lịch sử yêu cầu của học viên demo" description={student ? `Đang hiển thị ticket của ${student.fullName}.` : "Chưa có học viên demo để hiển thị ticket."} accent="sky">
          {student ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
                <p className="font-semibold text-white">{student.fullName}</p>
                <p className="mt-1">{student.level} • {student.phone}</p>
                <p className="mt-1 text-slate-400">Phụ huynh: {student.guardianName || "Chưa cập nhật"} • {student.guardianPhone || "Chưa cập nhật"}</p>
              </div>

              <div className="space-y-3">
                {myRequests.length ? (
                  myRequests.map((request) => (
                    <article key={request.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-white">{request.title}</p>
                          <p className="mt-1 text-slate-400">{request.createdAt}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${requestTypeClass[request.requestType]}`}>
                            {requestTypeLabel[request.requestType]}
                          </span>
                          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${requestStatusClass[request.status]}`}>
                            {requestStatusLabel[request.status]}
                          </span>
                        </div>
                      </div>
                      <p className="mt-3 leading-6">{request.description}</p>
                      <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Phản hồi từ trung tâm</p>
                        <p className="mt-2 text-slate-300">{request.response || "Yêu cầu đã được ghi nhận và đang chờ đội ngũ xử lý."}</p>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-sm text-slate-300">
                    Chưa có request demo cho học viên này.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-300">Chưa có học viên demo.</p>
          )}
        </SectionCard>
      </section>
    </StudentSubpageShell>
  );
}
