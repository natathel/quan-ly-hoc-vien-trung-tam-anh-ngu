import { SectionCard } from "@/components/shared/section-card";
import type { AttendanceRecord, Enrollment, Session, Student } from "@/lib/types";

import {
  attendanceLabel,
  formatCurrency,
  getCurrentStudentContext,
  getStudentAttendanceBySession,
  getStudentSessions,
  paymentLabel,
  studentStatusLabel,
} from "./student-portal-utils";
import { StudentSubpageShell } from "./student-subpage-shell";

type StudentSchedulePageProps = {
  students: Student[];
  enrollments: Enrollment[];
  sessions: Session[];
  attendanceRecords: AttendanceRecord[];
};

export function StudentSchedulePage({
  students,
  enrollments,
  sessions,
  attendanceRecords,
}: StudentSchedulePageProps) {
  const { student, currentEnrollment } = getCurrentStudentContext({ students, enrollments });
  const classSessions = getStudentSessions({ currentEnrollment, sessions });
  const { attendanceBySession } = getStudentAttendanceBySession({ student, attendanceRecords });

  const sortedClassSessions = [...classSessions].sort((a, b) => `${a.sessionDate} ${a.startTime}`.localeCompare(`${b.sessionDate} ${b.startTime}`));
  const upcomingClassSessions = sortedClassSessions.filter((session) => session.status === "scheduled");
  const completedClassSessions = [...sortedClassSessions]
    .filter((session) => session.status !== "scheduled")
    .sort((a, b) => `${b.sessionDate} ${b.startTime}`.localeCompare(`${a.sessionDate} ${a.startTime}`));
  const scheduleFeed = [...upcomingClassSessions, ...completedClassSessions];

  return (
    <StudentSubpageShell
      activeHref="/student/schedule"
      title={student ? `Lịch học của ${student.fullName}` : "Lịch học học viên demo"}
      description="Theo dõi lớp hiện tại, các buổi học sắp tới và trạng thái điểm danh của học viên demo. Các hành động ở trang này chỉ là giao diện minh hoạ cho phase 2."
    >
      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <SectionCard title="Tóm tắt học viên" description="Ngữ cảnh hiện tại lấy từ học viên demo đầu tiên." accent="sky">
          {student ? (
            <div className="space-y-4 text-sm text-slate-300">
              <div>
                <p className="text-xl font-semibold text-white">{student.fullName}</p>
                <p className="mt-1">{student.level} • {studentStatusLabel[student.status]} • Nhập học {student.enrollmentDate}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="font-medium text-white">Liên hệ</p>
                  <p className="mt-2">{student.phone}</p>
                  <p>{student.email}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="font-medium text-white">Phụ huynh</p>
                  <p className="mt-2">{student.guardianName || "Chưa cập nhật"}</p>
                  <p>{student.guardianPhone || "Chưa cập nhật"}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-medium text-white">Mục tiêu học tập</p>
                <p className="mt-2 leading-6">{student.learningGoal || "Chưa cập nhật"}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-300">Chưa có học viên demo.</p>
          )}
        </SectionCard>

        <SectionCard title="Lớp hiện tại" description="Thông tin ghi danh và nhịp học gần nhất." accent="emerald">
          {currentEnrollment ? (
            <div className="grid gap-3 text-sm text-slate-300 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-lg font-semibold text-white">{currentEnrollment.courseName}</p>
                <p className="mt-2">Trình độ: {currentEnrollment.level}</p>
                <p className="mt-1">Giáo viên: {currentEnrollment.teacher}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p>Bắt đầu: {currentEnrollment.startDate}</p>
                <p className="mt-1">Học phí tháng: {formatCurrency(currentEnrollment.monthlyFee ?? 0)}</p>
                <p className="mt-1">Trạng thái thu: {paymentLabel[currentEnrollment.paymentStatus]}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-300">Chưa xác định được lớp học hiện tại cho học viên demo.</p>
          )}
        </SectionCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title="Danh sách lịch học" description="Chỉ hiển thị các buổi thuộc lớp hiện tại của học viên; buổi sắp tới được ưu tiên trước, lịch sử buổi đã học ở phía sau." accent="violet">
          {scheduleFeed.length ? (
            <div className="space-y-3">
              {scheduleFeed.map((session) => {
                const attendance = attendanceBySession.get(session.id);
                const isCurrentClass = session.courseId === currentEnrollment?.courseId;

                return (
                  <div key={session.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-white">{session.courseName ?? currentEnrollment?.courseName ?? `Lớp #${session.courseId}`}</p>
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                            isCurrentClass
                              ? "bg-sky-400/10 text-sky-200"
                              : "bg-white/10 text-slate-300"
                          }`}>
                            {isCurrentClass ? "Lớp hiện tại" : "Buổi tham khảo"}
                          </span>
                          <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">{session.status === "scheduled" ? "Sắp diễn ra" : session.status === "completed" ? "Đã học" : "Đã hủy"}</span>
                        </div>
                        <p className="mt-2">{session.sessionDate} • {session.startTime} - {session.endTime}</p>
                        <p className="mt-1 text-slate-400">Chủ đề: {session.topic}</p>
                        <p className="mt-1 text-slate-400">Giáo viên: {session.teacherName ?? currentEnrollment?.teacher ?? "Đang cập nhật"}</p>
                      </div>

                      <div className="min-w-52 rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Điểm danh cá nhân</p>
                        <p className="mt-2 font-medium text-white">{attendance ? attendanceLabel[attendance.status] : "Chưa có dữ liệu"}</p>
                        <p className="mt-1 text-slate-400">{attendance?.note || "Buổi chưa phát sinh ghi chú điểm danh cho học viên."}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-300">Chưa có dữ liệu lịch học phù hợp.</p>
          )}
        </SectionCard>

        <SectionCard title="Thao tác nhanh" description="UI-only cho phụ huynh/học viên, chưa kết nối API gửi yêu cầu." accent="rose">
          <div className="grid gap-3 text-sm">
            {[
              {
                title: "Xin nghỉ",
                description: "Gửi yêu cầu xin nghỉ cho buổi học gần nhất hoặc sắp tới.",
              },
              {
                title: "Hỏi giáo vụ",
                description: "Mở khung trao đổi với giáo vụ về lịch học và điều phối lớp.",
              },
              {
                title: "Tải lịch học",
                description: "Xuất lịch học tháng hiện tại dưới dạng PDF/ảnh trong các phase sau.",
              },
            ].map((action) => (
              <button
                key={action.title}
                type="button"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left transition hover:border-sky-400/30 hover:text-sky-200"
              >
                <p className="font-medium text-white">{action.title}</p>
                <p className="mt-1 text-slate-400">{action.description}</p>
              </button>
            ))}
          </div>
        </SectionCard>
      </section>
    </StudentSubpageShell>
  );
}
