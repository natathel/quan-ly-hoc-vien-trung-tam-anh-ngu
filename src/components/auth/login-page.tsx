import Link from "next/link";

import { PortalNav } from "@/components/shared/portal-nav";

type UserRole = "student" | "teacher" | "admin";

type LoginPageProps = {
  defaultRole?: UserRole;
};

type RoleCard = {
  key: UserRole;
  label: string;
  shortLabel: string;
  description: string;
  action: string;
  accent: string;
  buttonClassName: string;
  demoAccount: string;
  demoPassword: string;
};

const roleCards: RoleCard[] = [
  {
    key: "student",
    label: "Học viên / phụ huynh",
    shortLabel: "học viên / phụ huynh",
    description: "Theo dõi lịch học, điểm danh, đánh giá và học phí trong cùng một cổng tra cứu.",
    action: "/student",
    accent: "border-sky-400/35 bg-sky-400/10 text-sky-100",
    buttonClassName: "bg-sky-400 text-slate-950 hover:bg-sky-300",
    demoAccount: "phuhuynh.demo@englishcenter.vn",
    demoPassword: "Parent@123",
  },
  {
    key: "teacher",
    label: "Giáo viên",
    shortLabel: "giáo viên",
    description: "Truy cập lịch dạy, điểm danh lớp, đánh giá học viên và watchlist cần theo dõi.",
    action: "/teacher",
    accent: "border-emerald-400/35 bg-emerald-400/10 text-emerald-100",
    buttonClassName: "bg-emerald-400 text-slate-950 hover:bg-emerald-300",
    demoAccount: "giaovien.demo@englishcenter.vn",
    demoPassword: "Teacher@123",
  },
  {
    key: "admin",
    label: "Admin / điều hành",
    shortLabel: "admin / điều hành",
    description: "Xem điều phối tuyển sinh, ghi danh, học vụ, tài chính và cảnh báo vận hành toàn trung tâm.",
    action: "/admin",
    accent: "border-violet-400/35 bg-violet-400/10 text-violet-100",
    buttonClassName: "bg-violet-400 text-slate-950 hover:bg-violet-300",
    demoAccount: "admin.demo@englishcenter.vn",
    demoPassword: "Admin@123",
  },
];

export function LoginPage({ defaultRole }: LoginPageProps) {
  const activeRole = roleCards.find((role) => role.key === defaultRole) ?? roleCards[0];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <PortalNav active="landing" />

        <section className="grid gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 shadow-2xl shadow-slate-950/30 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <span className="inline-flex rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-100">
              Authentication entry • phase 2 demo
            </span>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Đăng nhập hệ thống</h1>
              <p className="max-w-2xl text-base leading-8 text-slate-300">
                Chọn đúng cổng đăng nhập cho vai trò của anh/chị để đi vào trải nghiệm học viên, giáo viên hoặc điều hành.
                Đây là lớp UI đăng nhập demo trước khi nối xác thực, phân quyền và session ở phase sau.
              </p>
            </div>
            <div className={`rounded-3xl border p-5 ${activeRole.accent}`}>
              <p className="text-xs font-semibold uppercase tracking-[0.24em]">Đang chọn cổng {activeRole.shortLabel}</p>
              <p className="mt-3 text-sm leading-7 text-slate-200">
                Sau khi hoàn thiện backend auth, người dùng sẽ đăng nhập tại đây rồi được điều hướng vào đúng portal tương ứng.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/" className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-sky-400/30 hover:text-sky-100">
                Quay về landing page
              </Link>
              <Link href="/login" className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-amber-400/30 hover:text-amber-100">
                Xem tất cả cổng đăng nhập
              </Link>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            {roleCards.map((role) => {
              const isActive = role.key === activeRole.key;

              return (
                <form
                  key={role.key}
                  action={role.action}
                  className={`rounded-3xl border p-5 transition ${
                    isActive
                      ? "border-white/20 bg-white/10 shadow-lg shadow-slate-950/30"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-white">{role.label}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{role.description}</p>
                    </div>
                    {isActive ? (
                      <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white">
                        Focus
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-5 grid gap-4">
                    <label className="grid gap-2 text-sm text-slate-300">
                      Email / tên đăng nhập
                      <input
                        type="email"
                        defaultValue={role.demoAccount}
                        className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                        placeholder="name@example.com"
                      />
                    </label>
                    <label className="grid gap-2 text-sm text-slate-300">
                      Mật khẩu
                      <input
                        type="password"
                        defaultValue={role.demoPassword}
                        className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                        placeholder="••••••••"
                      />
                    </label>
                  </div>

                  <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
                    <p className="font-semibold text-white">Tài khoản demo</p>
                    <p className="mt-2">Email: {role.demoAccount}</p>
                    <p>Mật khẩu: {role.demoPassword}</p>
                  </div>

                  <div className="mt-5 space-y-3">
                    <button
                      type="submit"
                      className={`inline-flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-semibold transition ${role.buttonClassName}`}
                    >
                      Vào portal {role.shortLabel}
                    </button>
                    <p className="text-xs leading-6 text-slate-400">
                      UI đăng nhập demo: form hiện chưa kiểm tra thông tin thật, chưa tạo session và sẽ nối xác thực bảo mật ở phase sau.
                    </p>
                  </div>
                </form>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
