import { SectionCard } from "@/components/shared/section-card";
import type { Assessment, AssessmentScore, Enrollment, Student } from "@/lib/types";

import {
  assessmentTypeLabel,
  formatScore,
  getCurrentStudentContext,
  getStudentAssessmentRows,
  studentStatusLabel,
} from "./student-portal-utils";
import { StudentSubpageShell } from "./student-subpage-shell";

type StudentAssessmentsPageProps = {
  students: Student[];
  enrollments: Enrollment[];
  assessments: Assessment[];
  assessmentScores: AssessmentScore[];
};

export function StudentAssessmentsPage({
  students,
  enrollments,
  assessments,
  assessmentScores,
}: StudentAssessmentsPageProps) {
  const { student, currentEnrollment } = getCurrentStudentContext({ students, enrollments });
  const rows = getStudentAssessmentRows({ student, assessments, assessmentScores }).sort((a, b) => {
    const dateA = a.assessment?.assessmentDate ?? "";
    const dateB = b.assessment?.assessmentDate ?? "";
    return dateB.localeCompare(dateA);
  });

  const totalScores = rows.reduce((sum, item) => sum + item.score.score, 0);
  const averageScore = rows.length ? totalScores / rows.length : undefined;
  const strongestRow = rows.reduce<typeof rows[number] | undefined>((best, row) => {
    const ratio = row.assessment?.maxScore ? row.score.score / row.assessment.maxScore : 0;
    const bestRatio = best?.assessment?.maxScore ? best.score.score / best.assessment.maxScore : -1;
    return ratio > bestRatio ? row : best;
  }, undefined);
  const latestRow = rows[0];

  return (
    <StudentSubpageShell
      activeHref="/student/assessments"
      title={student ? `Đánh giá học tập của ${student.fullName}` : "Đánh giá học tập"}
      description="Ghép dữ liệu AssessmentScore với Assessment để phụ huynh/học viên xem điểm, nhận xét và gợi ý cải thiện theo lộ trình hiện tại."
    >
      <section className="grid gap-4 xl:grid-cols-3">
        <SectionCard title="Hồ sơ học tập" description="Thông tin nền để đọc bảng điểm." accent="sky">
          {student ? (
            <div className="space-y-3 text-sm text-slate-300">
              <p className="text-xl font-semibold text-white">{student.fullName}</p>
              <p>{student.level} • {studentStatusLabel[student.status]}</p>
              <p>Lớp hiện tại: {currentEnrollment?.courseName ?? "Chưa xác định"}</p>
              <p>Giáo viên phụ trách: {currentEnrollment?.teacher ?? "Chưa cập nhật"}</p>
            </div>
          ) : (
            <p className="text-sm text-slate-300">Chưa có học viên demo.</p>
          )}
        </SectionCard>

        <SectionCard title="Tổng hợp điểm" description="Thống kê nhanh cho học viên demo." accent="emerald">
          <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Số bài đã chấm</p>
              <p className="mt-2 text-2xl font-semibold text-white">{rows.length}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Điểm trung bình</p>
              <p className="mt-2 text-2xl font-semibold text-white">{formatScore(averageScore)}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Bài gần nhất</p>
              <p className="mt-2 font-semibold text-white">{latestRow?.assessment?.title ?? "Chưa có"}</p>
              <p className="mt-1 text-slate-400">{latestRow ? `${formatScore(latestRow.score.score)}/${formatScore(latestRow.assessment?.maxScore)}` : "Chưa có dữ liệu"}</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Khuyến nghị học tập" description="Gợi ý UI-only dựa trên kết quả hiện có." accent="amber">
          <div className="space-y-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-medium text-white">Điểm mạnh hiện tại</p>
              <p className="mt-2 leading-6">
                {strongestRow
                  ? `${strongestRow.assessment?.title ?? "Bài đánh giá"} đang là kết quả tốt nhất với ${formatScore(strongestRow.score.score)}/${formatScore(strongestRow.assessment?.maxScore)}.`
                  : "Chưa đủ dữ liệu để xác định điểm mạnh."}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-medium text-white">Đề xuất tiếp theo</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 leading-6 text-slate-300">
                <li>Ôn lại nhận xét của giáo viên ở từng bài gần đây để cải thiện lỗi lặp lại.</li>
                <li>Dành 15-20 phút mỗi ngày cho kỹ năng đang có điểm thấp hơn mức trung bình cá nhân.</li>
                <li>Trao đổi với giáo viên phụ trách nếu muốn nhận thêm bài luyện speaking/writing tại nhà.</li>
              </ul>
            </div>
          </div>
        </SectionCard>
      </section>

      <SectionCard title="Bảng điểm chi tiết" description="Hiển thị điểm số, loại bài, ngày kiểm tra, khóa học và nhận xét từ giáo viên." accent="violet">
        {rows.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-300">
              <thead>
                <tr className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  <th className="px-4 py-3">Bài đánh giá</th>
                  <th className="px-4 py-3">Loại</th>
                  <th className="px-4 py-3">Ngày</th>
                  <th className="px-4 py-3">Khóa học</th>
                  <th className="px-4 py-3">Điểm</th>
                  <th className="px-4 py-3">Nhận xét</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {rows.map(({ score, assessment }) => (
                  <tr key={score.id} className="align-top">
                    <td className="px-4 py-4 font-medium text-white">{assessment?.title ?? `Assessment #${score.assessmentId}`}</td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-sky-400/10 px-3 py-1 text-xs text-sky-200">
                        {assessment ? assessmentTypeLabel[assessment.assessmentType] : "Chưa rõ"}
                      </span>
                    </td>
                    <td className="px-4 py-4">{assessment?.assessmentDate ?? "-"}</td>
                    <td className="px-4 py-4">{assessment?.courseName ?? currentEnrollment?.courseName ?? "Lớp học"}</td>
                    <td className="px-4 py-4 font-semibold text-white">
                      {formatScore(score.score)}/{formatScore(assessment?.maxScore)}
                    </td>
                    <td className="px-4 py-4 text-slate-400">{score.feedback || "Chưa có nhận xét"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-slate-300">Chưa có điểm đánh giá cho học viên demo.</p>
        )}
      </SectionCard>
    </StudentSubpageShell>
  );
}
