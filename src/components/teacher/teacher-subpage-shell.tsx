import Link from "next/link";
import type { ReactNode } from "react";

import { PortalNav } from "@/components/shared/portal-nav";

const teacherSubpages = [
  { href: "/teacher", label: "Tổng quan" },
  { href: "/teacher/classes", label: "Lớp phụ trách" },
  { href: "/teacher/attendance", label: "Điểm danh" },
  { href: "/teacher/assessments", label: "Đánh giá" },
] as const;

type TeacherSubpageShellProps = {
  title: string;
  description: string;
  activeHref: (typeof teacherSubpages)[number]["href"];
  eyebrow?: string;
  children: ReactNode;
};

export function TeacherSubpageShell({
  title,
  description,
  activeHref,
  eyebrow = "Cổng giáo viên • giảng dạy & theo dõi lớp",
  children,
}: TeacherSubpageShellProps) {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <PortalNav active="teacher" />

        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/20 via-slate-900 to-sky-500/10 p-8 shadow-2xl shadow-emerald-950/20">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200">
                {eyebrow}
              </span>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h1>
              <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">{description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {teacherSubpages.map((item) => {
                const isActive = item.href === activeHref;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition ${
                      isActive
                        ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-100"
                        : "border-white/10 bg-white/5 text-slate-300 hover:border-emerald-400/30 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {children}
      </div>
    </main>
  );
}
