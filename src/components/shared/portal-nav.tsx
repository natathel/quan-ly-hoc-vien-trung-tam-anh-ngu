import Link from "next/link";

const navItems = [
  { key: "landing", href: "/", label: "Landing" },
  { key: "login", href: "/login", label: "Đăng nhập" },
  { key: "student", href: "/student/login", label: "Học viên" },
  { key: "teacher", href: "/teacher/login", label: "Giáo viên" },
  { key: "admin", href: "/admin/login", label: "Admin" },
] as const;

export type PortalNavActive = (typeof navItems)[number]["key"];

type PortalNavProps = {
  active?: PortalNavActive;
};

export function PortalNav({ active }: PortalNavProps) {
  return (
    <nav className="rounded-3xl border border-white/10 bg-slate-900/80 p-3 shadow-lg shadow-slate-950/30 backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">4 portal architecture</p>
          <p className="mt-1 text-sm text-slate-400">Điều hướng nhanh giữa landing, học viên, giáo viên và admin.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {navItems.map((item) => {
            const isActive = item.key === active;

            return (
              <Link
                key={item.key}
                href={item.href}
                className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "border-sky-400/40 bg-sky-400/15 text-sky-100"
                    : "border-white/10 bg-white/5 text-slate-300 hover:border-sky-400/30 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
