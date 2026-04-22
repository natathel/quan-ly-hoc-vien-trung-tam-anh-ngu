import type { ReactNode } from "react";

type Accent = "sky" | "emerald" | "amber" | "rose" | "violet";

type SectionCardProps = {
  id?: string;
  title: string;
  description?: string;
  children: ReactNode;
  accent?: Accent;
  className?: string;
};

const accentStyles: Record<Accent, string> = {
  sky: "from-sky-500/20 to-slate-900 border-sky-500/20",
  emerald: "from-emerald-500/20 to-slate-900 border-emerald-500/20",
  amber: "from-amber-500/20 to-slate-900 border-amber-500/20",
  rose: "from-rose-500/20 to-slate-900 border-rose-500/20",
  violet: "from-violet-500/20 to-slate-900 border-violet-500/20",
};

export function SectionCard({
  id,
  title,
  description,
  children,
  accent = "sky",
  className = "",
}: SectionCardProps) {
  return (
    <section
      id={id}
      className={`rounded-3xl border bg-gradient-to-br p-6 shadow-lg shadow-slate-950/30 ${accentStyles[accent]} ${className}`.trim()}
    >
      <div className="mb-5 space-y-1">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {description ? <p className="text-sm leading-6 text-slate-300">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
