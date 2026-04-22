import Link from "next/link";

import { PortalNav } from "@/components/shared/portal-nav";
import { SectionCard } from "@/components/shared/section-card";

const programs = [
  {
    title: "Tiếng Anh thiếu nhi",
    description: "Xây nền phát âm, phản xạ và kỹ năng lớp học cho học viên tiểu học.",
    highlight: "Lộ trình Cambridge Starters → Movers → Flyers",
  },
  {
    title: "Giao tiếp thực chiến",
    description: "Tăng phản xạ nghe nói với các chủ đề đời sống, trường học và công việc.",
    highlight: "Mô hình luyện nói 1-1 + workshop cuối tuần",
  },
  {
    title: "IELTS tăng tốc",
    description: "Theo dõi mục tiêu band, kết quả assessment và kế hoạch học cá nhân hoá.",
    highlight: "Dashboard band mục tiêu, tiến độ và cảnh báo cần can thiệp",
  },
  {
    title: "Mất gốc lấy lại nền tảng",
    description: "Tập trung ngữ pháp, từ vựng và thói quen học đều để quay lại lộ trình chuẩn.",
    highlight: "Kiểm tra đầu vào và xếp lớp theo năng lực thực tế",
  },
] as const;

const operatingValues = [
  ["Học vụ", "Quản lý hồ sơ, lớp học, ghi danh và chăm sóc phụ huynh trên một luồng dữ liệu."],
  ["Giáo viên", "Theo dõi lịch dạy, điểm danh, đánh giá và watchlist học viên cần chú ý."],
  ["Tài chính", "Nắm hóa đơn, công nợ, thanh toán và các cảnh báo quá hạn theo thời gian thực."],
  ["Báo cáo", "Tổng hợp KPI vận hành để ban điều hành ra quyết định nhanh hơn mỗi ngày."],
] as const;

const workflow = [
  "Đăng ký tư vấn và tiếp nhận nhu cầu học tập",
  "Kiểm tra đầu vào, xác định mục tiêu và lộ trình phù hợp",
  "Xếp lớp theo năng lực, thời gian biểu và giáo viên phụ trách",
  "Theo dõi tiến bộ qua điểm danh, đánh giá và chăm sóc định kỳ",
] as const;

const teacherHighlights = [
  "Đội ngũ giáo viên có năng lực chuyên môn theo từng nhóm lớp: thiếu nhi, giao tiếp, IELTS.",
  "Báo cáo lớp học, bài tập và nhận xét học viên được đồng bộ sau mỗi buổi học.",
  "Watchlist học viên cần chăm sóc giúp giáo viên phối hợp nhanh với học vụ và phụ huynh.",
] as const;

const faqs = [
  ["Trung tâm có phù hợp cho học viên mất gốc không?", "Có. Lộ trình đầu vào được chia theo năng lực thực tế để học viên bắt đầu từ nền tảng phù hợp nhất."],
  ["Phụ huynh theo dõi tiến độ học như thế nào?", "Portal học viên hiển thị lớp đang học, lịch buổi tới, điểm danh, đánh giá và hóa đơn mở để phụ huynh nắm tình hình nhanh."],
  ["Giáo viên cập nhật báo cáo lớp ở đâu?", "Teacher portal được thiết kế để điểm danh, ghi nhận đánh giá, theo dõi watchlist và gửi yêu cầu vận hành."],
  ["Giai đoạn này lead form đã hoạt động chưa?", "Chưa. Form hiện là giao diện demo để hoàn thiện trải nghiệm tuyển sinh trước khi nối API CRM ở phase sau."],
] as const;

export function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <PortalNav active="landing" />

        <section className="grid gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-sky-500/20 via-slate-900 to-emerald-500/10 p-8 shadow-2xl shadow-sky-950/20 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-5">
            <span className="inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">
              Landing portal • tuyển sinh & trải nghiệm phụ huynh
            </span>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Trung tâm anh ngữ với trải nghiệm 4 portal thống nhất từ tuyển sinh đến vận hành.
              </h1>
              <p className="max-w-3xl text-base leading-8 text-slate-300">
                Demo phase 1 tập trung vào landing page, portal học viên, portal giáo viên và admin portal để
                giúp trung tâm kiểm soát toàn bộ hành trình: tuyển sinh, xếp lớp, học tập, tài chính và chăm sóc.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/student" className="rounded-full bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300">
                Xem portal học viên
              </Link>
              <Link href="/teacher" className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-emerald-400/30 hover:text-emerald-200">
                Xem portal giáo viên
              </Link>
              <Link href="/admin" className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-violet-400/30 hover:text-violet-200">
                Vào admin portal
              </Link>
            </div>
          </div>

          <div className="grid gap-3 rounded-3xl border border-white/10 bg-slate-950/60 p-5">
            {[
              ["Lead → xếp lớp", "Một luồng tuyển sinh rõ ràng với CTA, workflow và form tư vấn."],
              ["Học viên → phụ huynh", "Portal theo dõi lớp học, điểm danh, đánh giá và học phí."],
              ["Giáo viên → vận hành", "Portal tập trung cho lịch dạy, điểm danh và watchlist."],
            ].map(([title, description]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {programs.map((program, index) => (
            <SectionCard
              key={program.title}
              title={program.title}
              description={program.description}
              accent={index % 2 === 0 ? "sky" : "emerald"}
            >
              <p className="text-sm font-medium text-slate-100">{program.highlight}</p>
            </SectionCard>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <SectionCard
            title="Giá trị vận hành"
            description="Thiết kế portal mới giúp đội ngũ tuyển sinh, học vụ, giáo viên và quản lý nhìn chung một bộ dữ liệu."
            accent="violet"
          >
            <div className="grid gap-3 md:grid-cols-2">
              {operatingValues.map(([title, description]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Quy trình tuyển sinh & nhập học"
            description="Luồng trải nghiệm được chuẩn hoá để giảm thất thoát lead và tăng tốc độ xếp lớp."
            accent="amber"
          >
            <ol className="space-y-3">
              {workflow.map((step, index) => (
                <li key={step} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-400/15 text-sm font-semibold text-amber-200">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6 text-slate-200">{step}</p>
                </li>
              ))}
            </ol>
          </SectionCard>
        </section>

        <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <SectionCard
            title="Điểm nổi bật cho giáo viên"
            description="Portal giáo viên giúp giảm thao tác rời rạc và giữ lớp học luôn cập nhật."
            accent="emerald"
          >
            <div className="space-y-3">
              {teacherHighlights.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Câu hỏi thường gặp"
            description="Những nội dung thường được phụ huynh và đội ngũ vận hành hỏi ở giai đoạn đầu."
            accent="rose"
          >
            <div className="space-y-3">
              {faqs.map(([question, answer]) => (
                <div key={question} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-white">{question}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{answer}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </section>

        <SectionCard
          id="dang-ky-tu-van"
          title="Đăng ký tư vấn"
          description="Lead form UI cho phase 1. Chưa có submit handler, nhưng đã sẵn sàng để nối CRM tuyển sinh ở phase sau."
          accent="sky"
        >
          <form className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-slate-300">
              Họ và tên học viên
              <input className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500" placeholder="Nguyễn Minh Anh" />
            </label>
            <label className="grid gap-2 text-sm text-slate-300">
              Số điện thoại phụ huynh
              <input className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500" placeholder="0901 234 567" />
            </label>
            <label className="grid gap-2 text-sm text-slate-300">
              Mục tiêu học tập
              <input className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500" placeholder="Giao tiếp / IELTS / Cambridge" />
            </label>
            <label className="grid gap-2 text-sm text-slate-300">
              Khung giờ mong muốn
              <input className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500" placeholder="Tối T3-T5 hoặc cuối tuần" />
            </label>
            <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
              Ghi chú thêm
              <textarea className="min-h-32 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-slate-500" placeholder="Ví dụ: học viên mất gốc, cần test đầu vào, muốn học cùng anh/chị em..." />
            </label>
            <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-300">UI only trong phase 1 — dữ liệu chưa được gửi đi.</p>
              <button type="button" className="rounded-full bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300">
                Gửi yêu cầu tư vấn
              </button>
            </div>
          </form>
        </SectionCard>
      </div>
    </main>
  );
}
