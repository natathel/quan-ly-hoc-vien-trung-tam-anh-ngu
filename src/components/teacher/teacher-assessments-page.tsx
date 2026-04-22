import { SectionCard } from "@/components/shared/section-card";
import type { Assessment, AssessmentScore, Course, Enrollment, Teacher } from "@/lib/types";

import {
  assessmentTypeLabel,
  formatPercent,
  formatScore,
  getCurrentTeacherContext,
  getScoresByAssessment,
  getTeacherAssessments,
  getTeacherEnrollments,
  teacherStatusLabel,
} from "./teacher-portal-utils";
import { TeacherSubpageShell } from "./teacher-subpage-shell";

type TeacherAssessmentsPageProps = {
  teachers: Teacher[];
  courses: Course[];
  enrollments: Enrollment[];
  assessments: Assessment[];
  assessmentScores: AssessmentScore[];
};

export function TeacherAssessmentsPage({
  teachers,
  courses,
  enrollments,
  assessments,
  assessmentScores,
}: TeacherAssessmentsPageProps) {
  const { teacher, assignedCourses, assignedCourseIds } = getCurrentTeacherContext({ teachers, courses });
  const teacherAssessments = getTeacherAssessments({ assessments, assignedCourseIds }).sort((a, b) => {
    return `${b.assessmentDate} ${b.id}`.localeCompare(`${a.assessmentDate} ${a.id}`);
  });
  const scoresByAssessment = getScoresByAssessment({ assessments: teacherAssessments, assessmentScores });
  const teacherEnrollments = getTeacherEnrollments({ enrollments, assignedCourseIds });

  const assessmentRows = teacherAssessments.map((assessment) => {
    const scores = scoresByAssessment.get(assessment.id) ?? [];
    const scoredCount = scores.length;
    const averageScore = scoredCount ? scores.reduce((sum, item) => sum + item.score, 0) / scoredCount : undefined;
    const averagePercent = averageScore !== undefined && assessment.maxScore ? (averageScore / assessment.maxScore) * 100 : undefined;
    const feedbackCount = scores.filter((score) => score.feedback.trim().length > 0).length;
    const courseEnrollmentCount = teacherEnrollments.filter((enrollment) => enrollment.courseId === assessment.courseId && !enrollment.endDate).length;

    return {
      assessment,
      scores,
      scoredCount,
      averageScore,
      averagePercent,
      feedbackCount,
      courseEnrollmentCount,
    };
  });

  const totalScores = assessmentRows.reduce((sum, row) => sum + row.scoredCount, 0);
  const totalFeedback = assessmentRows.reduce((sum, row) => sum + row.feedbackCount, 0);
  const weightedAverage = assessmentRows.length
    ? assessmentRows.reduce((sum, row) => sum + (row.averagePercent ?? 0), 0) / assessmentRows.length
    : undefined;

  return (
    <TeacherSubpageShell
      activeHref="/teacher/assessments"
      title={teacher ? `Đánh giá lớp của ${teacher.fullName}` : "Đánh giá giáo viên demo"}
      description="Tổng hợp bài đánh giá thuộc các lớp giáo viên demo phụ trách, ghép điểm theo từng bài, hiển thị tỷ lệ đã chấm, điểm trung bình và nhận xét. Các nút thao tác chỉ minh hoạ giao diện."
    >
      <section className="grid gap-4 xl:grid-cols-3">
        <SectionCard title="Hồ sơ đánh giá" description="Ngữ cảnh giáo viên và lớp đang chấm điểm." accent="emerald">
          {teacher ? (
            <div className="space-y-3 text-sm text-slate-300">
              <p className="text-xl font-semibold text-white">{teacher.fullName}</p>
              <p>{teacher.specialization} • {teacherStatusLabel[teacher.status]}</p>
              <p>Lớp phụ trách: {assignedCourses.length}</p>
              <p>Bài đánh giá liên quan: {teacherAssessments.length}</p>
            </div>
          ) : (
            <p className="text-sm text-slate-300">Chưa có giáo viên demo.</p>
          )}
        </SectionCard>

        <SectionCard title="Tổng hợp chấm điểm" description="Chỉ số nhanh trên các bài đánh giá của giáo viên demo." accent="sky">
          <div className="grid gap-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Bài đã có điểm</p>
              <p className="mt-2 text-2xl font-semibold text-white">{totalScores}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">TB % theo bài đánh giá</p>
              <p className="mt-2 text-2xl font-semibold text-white">{formatPercent(weightedAverage)}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Nhận xét đã nhập</p>
              <p className="mt-2 text-2xl font-semibold text-white">{totalFeedback}</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Thao tác nhanh" description="Chỉ minh hoạ giao diện, chưa kết nối chức năng tạo bài hoặc nhập điểm." accent="rose">
          <div className="grid gap-3 text-sm">
            {[
              {
                title: "Tạo bài đánh giá",
                description: "Mở form nháp tạo quiz/midterm/speaking cho lớp phụ trách.",
              },
              {
                title: "Nhập điểm",
                description: "Chuẩn bị bảng nhập điểm hàng loạt cho bài đánh giá được chọn.",
              },
              {
                title: "Gửi nhận xét",
                description: "Soạn nhận xét học tập gửi cho học viên/phụ huynh sau khi chấm.",
              },
            ].map((action) => (
              <button
                key={action.title}
                type="button"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left transition hover:border-rose-400/30 hover:text-rose-200"
              >
                <p className="font-medium text-white">{action.title}</p>
                <p className="mt-1 text-slate-400">{action.description}</p>
              </button>
            ))}
          </div>
        </SectionCard>
      </section>

      <SectionCard title="Bài đánh giá theo lớp" description="Mỗi bài đánh giá được ghép với bảng điểm để hiển thị số bài đã chấm, điểm trung bình, phần trăm và trạng thái nhận xét." accent="violet">
        {assessmentRows.length ? (
          <div className="space-y-4">
            {assessmentRows.map(({ assessment, scores, scoredCount, averageScore, averagePercent, feedbackCount, courseEnrollmentCount }) => (
              <div key={assessment.id} className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-lg font-semibold text-white">{assessment.title}</p>
                      <span className="rounded-full bg-violet-400/10 px-3 py-1 text-xs text-violet-200">
                        {assessmentTypeLabel[assessment.assessmentType]}
                      </span>
                    </div>
                    <p className="mt-2">{assessment.courseName ?? `Lớp #${assessment.courseId}`} • {assessment.assessmentDate}</p>
                    <p className="mt-1 text-slate-400">Điểm tối đa: {formatScore(assessment.maxScore)} • Trọng số {assessment.weight}%</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Đã chấm</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{scoredCount}/{courseEnrollmentCount || scoredCount}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Điểm TB</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{formatScore(averageScore)}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">TB %</p>
                      <p className="mt-2 text-2xl font-semibold text-emerald-200">{formatPercent(averagePercent)}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Nhận xét</p>
                      <p className="mt-2 text-2xl font-semibold text-sky-200">{feedbackCount}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <p className="font-medium text-white">Tóm tắt phản hồi</p>
                  <p className="mt-2 leading-6 text-slate-400">
                    {feedbackCount
                      ? `${feedbackCount}/${scoredCount} bài đã có nhận xét. ${scores.find((score) => score.feedback)?.feedback ?? "Các nhận xét chi tiết nằm trong bảng điểm."}`
                      : "Chưa có nhận xét cho bài đánh giá này."}
                  </p>
                </div>

                <div className="mt-4 overflow-x-auto">
                  {scores.length ? (
                    <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-300">
                      <thead>
                        <tr className="text-xs uppercase tracking-[0.18em] text-slate-400">
                          <th className="px-4 py-3">Học viên</th>
                          <th className="px-4 py-3">Điểm</th>
                          <th className="px-4 py-3">Tỷ lệ</th>
                          <th className="px-4 py-3">Nhận xét</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {scores.map((score) => {
                          const scorePercent = assessment.maxScore ? (score.score / assessment.maxScore) * 100 : undefined;

                          return (
                            <tr key={score.id} className="align-top">
                              <td className="px-4 py-4 font-medium text-white">{score.studentName ?? `Học viên #${score.studentId}`}</td>
                              <td className="px-4 py-4">{formatScore(score.score)}/{formatScore(assessment.maxScore)}</td>
                              <td className="px-4 py-4">{formatPercent(scorePercent)}</td>
                              <td className="px-4 py-4 text-slate-400">{score.feedback || "Chưa có nhận xét"}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-sm text-slate-400">Bài đánh giá này chưa có điểm học viên.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-300">Chưa có bài đánh giá thuộc các lớp giáo viên demo.</p>
        )}
      </SectionCard>
    </TeacherSubpageShell>
  );
}
