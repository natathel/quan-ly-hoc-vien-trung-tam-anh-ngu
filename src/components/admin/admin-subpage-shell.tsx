import Link from "next/link";
import type { ReactNode } from "react";

import { PortalNav } from "@/components/shared/portal-nav";

export const adminSubpages = [
  { href: "/admin", label: "Tổng quan" },
  { href: "/admin/students", label: "Học viên" },
  { href: "/admin/teachers", label: "Giáo viên" },
  { href: "/admin/courses", label: "Khoá học" },
  { href: "/admin/enrollments", label: "Ghi danh" },
  { href: "/admin/invoices", label: "Hóa đơn" },
  { href: "/admin/leads", label: "Lead CRM" },
] as const;

export type AdminSubpageHref = (typeof adminSubpages)[number]["href"];

type AdminModuleNavProps = {
  activeHref: AdminSubpageHref;
};

export function AdminModuleNav({ activeHref }: AdminModuleNavProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {adminSubpages.map((item) => {
        const isActive = item.href === activeHref;

        return (
          <Link
            key={item.href}
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
  );
}

type AdminSubpageShellProps = {
  title: string;
  description: string;
  activeHref: AdminSubpageHref;
  eyebrow?: string;
  children: ReactNode;
};

export function AdminSubpageShell({
  title,
  description,
  activeHref,
  eyebrow = "Admin portal • điều hành trung tâm",
  children,
}: AdminSubpageShellProps) {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <PortalNav active="admin" />

        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-sky-500/20 via-slate-900 to-violet-500/10 p-8 shadow-2xl shadow-sky-950/20">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">
                {eyebrow}
              </span>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h1>
              <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">{description}</p>
            </div>

            <AdminModuleNav activeHref={activeHref} />
          </div>
        </section>

        {children}
      </div>
    </main>
  );
}
