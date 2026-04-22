import Link from "next/link";

import { SectionCard } from "@/components/shared/section-card";
import type { Notification } from "@/lib/types";

import { AdminSubpageShell } from "./admin-subpage-shell";

const audienceOrder = ["all", "students", "teachers", "staff"] as const;
const priorityOrder = ["critical", "high", "normal"] as const;

const audienceLabel: Record<Notification["audience"], string> = {
  all: "Toàn trung tâm",
  students: "Học viên/phụ huynh",
  teachers: "Giáo viên",
  staff: "Nhân sự vận hành",
};

const audienceClass: Record<Notification["audience"], string> = {
  all: "border-sky-500/20 bg-sky-500/10 text-sky-200",
  students: "border-emerald-500/20 bg-emerald-500/10 text-emerald-200",
  teachers: "border-violet-500/20 bg-violet-500/10 text-violet-200",
  staff: "border-amber-500/20 bg-amber-500/10 text-amber-200",
};

const priorityLabel: Record<Notification["priority"], string> = {
  normal: "Bình thường",
  high: "Ưu tiên cao",
  critical: "Khẩn cấp",
};

const priorityClass: Record<Notification["priority"], string> = {
  normal: "border-slate-500/20 bg-slate-500/10 text-slate-200",
  high: "border-amber-500/20 bg-amber-500/10 text-amber-200",
  critical: "border-rose-500/20 bg-rose-500/10 text-rose-200",
};

function groupByAudience(notifications: Notification[]) {
  return new Map(audienceOrder.map((audience) => [audience, notifications.filter((item) => item.audience === audience)]));
}

function groupByPriority(notifications: Notification[]) {
  return new Map(priorityOrder.map((priority) => [priority, notifications.filter((item) => item.priority === priority)]));
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function isNotificationActive(notification: Notification, today = todayIso()) {
  return notification.publishedAt <= today && (!notification.expiresAt || notification.expiresAt >= today);
}

function isStudentVisible(notification: Notification, today = todayIso()) {
  return isNotificationActive(notification, today) && (notification.audience === "all" || notification.audience === "students");
}

type AdminNotificationsPageProps = {
  notifications: Notification[];
};

export function AdminNotificationsPage({ notifications }: AdminNotificationsPageProps) {
  const groupedByAudience = groupByAudience(notifications);
  const groupedByPriority = groupByPriority(notifications);
  const activeNotifications = notifications.filter((notification) => isNotificationActive(notification));
  const studentVisible = notifications.filter((notification) => isStudentVisible(notification)).length;

  return (
    <AdminSubpageShell
      activeHref="/admin/notifications"
      title="Trung tâm thông báo"
      description="Quản trị announcements theo audience và priority, đồng thời liên kết trực tiếp với API /api/notifications để đồng bộ thông báo cho các portal."
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Tổng thông báo", value: notifications.length, accent: "text-sky-300" },
          { label: "Đang hiển thị", value: activeNotifications.length, accent: "text-emerald-300" },
          { label: "Học viên nhìn thấy", value: studentVisible, accent: "text-violet-300" },
          { label: "Critical", value: groupedByPriority.get("critical")?.length ?? 0, accent: "text-rose-300" },
        ].map((item) => (
          <article key={item.label} className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/30">
            <p className="text-sm text-slate-400">{item.label}</p>
            <p className={`mt-3 text-3xl font-semibold ${item.accent}`}>{item.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard title="Announcement theo vai trò" description="Mỗi audience đại diện một kênh phát: all, students, teachers, staff. Student portal chỉ đọc all/students." accent="sky">
          <div className="grid gap-4 lg:grid-cols-2">
            {audienceOrder.map((audience) => (
              <div key={audience} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${audienceClass[audience]}`}>
                    {audienceLabel[audience]}
                  </span>
                  <span className="text-xs text-slate-400">{groupedByAudience.get(audience)?.length ?? 0} tin</span>
                </div>

                <div className="space-y-3">
                  {(groupedByAudience.get(audience) ?? []).map((notification) => (
                    <article key={notification.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <p className="font-semibold text-white">{notification.title}</p>
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${priorityClass[notification.priority]}`}>
                          {priorityLabel[notification.priority]}
                        </span>
                      </div>
                      <p className="mt-2 leading-6">{notification.message}</p>
                      <p className="mt-3 text-xs text-slate-500">
                        Published {notification.publishedAt}
                        {notification.expiresAt ? ` • expires ${notification.expiresAt}` : " • no expiry"}
                      </p>
                    </article>
                  ))}

                  {!(groupedByAudience.get(audience)?.length) ? (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-400">
                      Chưa có thông báo cho audience này.
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="grid gap-4">
          <SectionCard title="Priority mix" description="Theo dõi mức độ ưu tiên để admin biết thông báo nào cần đẩy nổi bật trên portal." accent="rose">
            <div className="space-y-3">
              {priorityOrder.map((priority) => (
                <article key={priority} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  <div className="flex items-center justify-between gap-3">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${priorityClass[priority]}`}>
                      {priorityLabel[priority]}
                    </span>
                    <span className="text-sm font-semibold text-white">{groupedByPriority.get(priority)?.length ?? 0}</span>
                  </div>
                </article>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="API vận hành" description="Luồng create/list đã có ở API; trang này làm màn hình kiểm soát và tài liệu usage cho admin." accent="emerald">
            <div className="space-y-3 text-sm text-slate-300">
              <Link href="/api/notifications" className="block rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 font-medium text-emerald-100 transition hover:border-emerald-300/40 hover:text-white">
                GET /api/notifications
              </Link>
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="font-semibold text-white">POST /api/notifications</p>
                <p className="mt-2 leading-6">
                  Payload vận hành gồm audience, title, message, priority, publishedAt và expiresAt. API validate audience all/students/teachers/staff và priority normal/high/critical.
                </p>
              </div>
              <Link href="/student/requests" className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-sky-400/30 hover:text-sky-200">
                Kiểm tra thông báo hiển thị trên Student requests page
              </Link>
            </div>
          </SectionCard>

          <SectionCard title="Checklist xuất bản" description="Gợi ý thao tác thủ công trước khi gọi API từ tool nội bộ hoặc tích hợp CRM." accent="amber">
            <ol className="list-inside list-decimal space-y-2 text-sm leading-6 text-slate-300">
              <li>Chọn đúng audience để tránh gửi nhầm thông báo nội bộ.</li>
              <li>Dùng priority critical cho thay đổi lịch khẩn hoặc sự cố vận hành.</li>
              <li>Thiết lập expiresAt cho campaign/announcement ngắn hạn.</li>
              <li>Kiểm tra student portal nếu audience là all hoặc students.</li>
            </ol>
          </SectionCard>
        </div>
      </section>
    </AdminSubpageShell>
  );
}
