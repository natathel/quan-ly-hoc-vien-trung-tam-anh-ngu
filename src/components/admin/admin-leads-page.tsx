import { SectionCard } from "@/components/shared/section-card";
import type { Lead } from "@/lib/types";

import { AdminSubpageShell } from "./admin-subpage-shell";

const leadStages = ["Mới", "Đã tư vấn", "Hẹn kiểm tra đầu vào", "Chốt ghi danh", "Thất bại"] as const;
type LeadStage = (typeof leadStages)[number];

type AdminLeadItem = {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  source: string;
  interest: string;
  note: string;
  owner: string;
  stage: LeadStage;
  updatedAt: string;
};

const stageAccentClass: Record<LeadStage, string> = {
  Mới: "border-sky-500/20 bg-sky-500/10 text-sky-200",
  "Đã tư vấn": "border-amber-500/20 bg-amber-500/10 text-amber-200",
  "Hẹn kiểm tra đầu vào": "border-violet-500/20 bg-violet-500/10 text-violet-200",
  "Chốt ghi danh": "border-emerald-500/20 bg-emerald-500/10 text-emerald-200",
  "Thất bại": "border-rose-500/20 bg-rose-500/10 text-rose-200",
};

function mapLeadStatus(status: Lead["status"]): LeadStage {
  switch (status) {
    case "new":
      return "Mới";
    case "contacted":
      return "Đã tư vấn";
    case "trial_scheduled":
      return "Hẹn kiểm tra đầu vào";
    case "converted":
      return "Chốt ghi danh";
    case "lost":
      return "Thất bại";
    default:
      return "Mới";
  }
}

function mapLeadToAdminItem(lead: Lead): AdminLeadItem {
  return {
    id: lead.id,
    fullName: lead.fullName,
    phone: lead.phone,
    email: lead.email,
    source: lead.source,
    interest: lead.programInterest,
    note: lead.note || "Chưa có ghi chú chăm sóc.",
    owner: "Chưa phân công",
    stage: mapLeadStatus(lead.status),
    updatedAt: lead.updatedAt,
  };
}

function groupLeadByStage(leads: AdminLeadItem[]) {
  return new Map(leadStages.map((stage) => [stage, leads.filter((lead) => lead.stage === stage)]));
}

type AdminLeadsPageProps = {
  leads: Lead[];
};

export function AdminLeadsPage({ leads }: AdminLeadsPageProps) {
  const normalizedLeads = leads.map(mapLeadToAdminItem);
  const groupedLeads = groupLeadByStage(normalizedLeads);

  return (
    <AdminSubpageShell
      activeHref="/admin/leads"
      title="Bảng lead tuyển sinh"
      description="Bảng CRM tuyển sinh đọc từ dữ liệu lead đã lưu qua API landing page và các nguồn marketing demo."
    >
      <section className="grid gap-4 sm:grid-cols-5">
        {leadStages.map((stage) => (
          <article key={stage} className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/30">
            <p className="text-sm text-slate-400">{stage}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{groupedLeads.get(stage)?.length ?? 0}</p>
          </article>
        ))}
      </section>

      <SectionCard title="Kanban lead tuyển sinh" description="Dữ liệu được đồng bộ từ bảng leads trong SQLite; admin có thể theo dõi lead theo từng giai đoạn chăm sóc." accent="sky">
        {normalizedLeads.length ? (
          <div className="grid gap-4 xl:grid-cols-5">
            {leadStages.map((stage) => (
              <div key={stage} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${stageAccentClass[stage]}`}>{stage}</span>
                  <span className="text-xs text-slate-400">{groupedLeads.get(stage)?.length ?? 0} lead</span>
                </div>
                <div className="space-y-3">
                  {(groupedLeads.get(stage) ?? []).map((lead) => (
                    <article key={lead.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                      <p className="font-semibold text-white">{lead.fullName}</p>
                      <p className="mt-2">{lead.interest}</p>
                      <p className="mt-1 text-slate-400">{lead.phone} • {lead.source}</p>
                      <p className="mt-1 text-slate-500">{lead.email}</p>
                      <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-500">Phụ trách</p>
                      <p className="mt-1">{lead.owner}</p>
                      <p className="mt-3 text-slate-400">{lead.note}</p>
                      <p className="mt-3 text-xs text-slate-500">Cập nhật: {lead.updatedAt}</p>
                      <button type="button" className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-2 text-left transition hover:border-sky-400/30 hover:text-sky-200">
                        Mở hồ sơ tư vấn
                      </button>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-6 text-sm text-slate-300">
            Chưa có lead nào trong hệ thống. Lead mới tạo qua API `/api/leads` sẽ xuất hiện tại đây để admin chăm sóc.
          </div>
        )}
      </SectionCard>
    </AdminSubpageShell>
  );
}
