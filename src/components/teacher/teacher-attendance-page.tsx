import { SectionCard } from "@/components/shared/section-card";
import type { AttendanceRecord, Course, Enrollment, Session, Teacher } from "@/lib/types";

import {
  attendanceLabel,
  countAttendance,
  getCurrentTeacherContext,
  getTeacherAttendanceRecords,
  getTeacherEnrollments,
  getTeacherSessions,
  sessionStatusLabel,
  teacherStatusLabel,
} from "./teacher-portal-utils";
import { TeacherSubpageShell } from "./teacher-subpage-shell";

type TeacherAttendancePageProps = {
  teachers: Teacher[];
  courses: Course[];
  enrollments: Enrollment[];
  sessions: Session[];
  attendanceRecords: AttendanceRecord[];
};

export function TeacherAttendancePage({
  teachers,
  courses,
  enrollments,
  sessions,
  attendanceRecords,
}: TeacherAttendancePageProps) {
  const { teacher, assignedCourses, assignedCourseIds } = getCurrentTeacherContext({ teachers, courses });
  const teacherSessions = getTeacherSessions({ sessions, assignedCourseIds }).sort((a, b) => {
    return `${b.sessionDate} ${b.startTime}`.localeCompare(`${a.sessionDate} ${a.startTime}`);
  });
  const teacherAttendanceRecords = getTeacherAttendanceRecords({ attendanceRecords, teacherSessions });
  const teacherEnrollments = getTeacherEnrollments({ enrollments, assignedCourseIds });

  const groupedSessions = teacherSessions.map((session) => {
    const records = teacherAttendanceRecords.filter((record) => record.sessionId === session.id);
    return {
      session,
      records,
      counts: countAttendance(records),
      classEnrollmentCount: teacherEnrollments.filter((enrollment) => enrollment.courseId === session.courseId && !enrollment.endDate).length,
    };
  });

  const nextSession = groupedSessions.find((item) => item.session.status === "scheduled") ?? groupedSessions[0];

  return (
    <TeacherSubpageShell
      activeHref="/teacher/attendance"
      title={teacher ? `Điểm danh lớp của ${teacher.fullName}` : "Điểm danh giáo viên demo"}
      description="Theo dõi các buổi học thuộc lớp giáo viên demo phụ trách, xem bản ghi điểm danh theo từng buổi và thử các thao tác đánh dấu minh hoạ."
    >
      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionCard title="Ngữ cảnh điểm danh" description="Chỉ buổi học thuộc các lớp của giáo viên demo mới được hiển thị." accent="emerald">
          {teacher ? (
            <div className="space-y-4 text-sm text-slate-300">
              <div>
                <p className="text-xl font-semibold text-white">{teacher.fullName}</p>
                <p className="mt-1">{teacher.specialization} • {teacherStatusLabel[teacher.status]}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Lớp phụ trách</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{assignedCourses.length}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Buổi học liên quan</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{teacherSessions.length}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Bản ghi điểm danh</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{teacherAttendanceRecords.length}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-300">Chưa có giáo viên demo.</p>
          )}
        </SectionCard>

        <SectionCard title="Khu thao tác điểm danh" description="Minh hoạ hành động đánh dấu điểm danh; chưa có chức năng ghi dữ liệu thật." accent="amber">
          <div className="space-y-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold text-white">{nextSession?.session.courseName ?? "Chưa có lớp"}</p>
              <p className="mt-2">
                {nextSession
                  ? `${nextSession.session.sessionDate} • ${nextSession.session.startTime}-${nextSession.session.endTime}`
                  : "Chưa có buổi học để thao tác."}
              </p>
              <p className="mt-1 text-slate-400">
                {nextSession
                  ? `Dự kiến sĩ số: ${nextSession.classEnrollmentCount} • Có mặt hiện tại: ${nextSession.counts.present}`
                  : "Không có dữ liệu sĩ số."}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                "Đánh dấu có mặt",
                "Đánh dấu vắng",
                "Đánh dấu đi trễ",
                "Ghi nhận có phép",
              ].map((action) => (
                <button
                  key={action}
                  type="button"
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left font-medium text-white transition hover:border-amber-400/30 hover:text-amber-200"
                >
                  {action}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left transition hover:border-sky-400/30 hover:text-sky-200"
            >
              <p className="font-medium text-white">Gửi tóm tắt điểm danh</p>
              <p className="mt-1 text-slate-400">Chuẩn bị gửi báo cáo điểm danh cho giáo vụ/phụ huynh trong các phase tiếp theo.</p>
            </button>
          </div>
        </SectionCard>
      </section>

      <SectionCard title="Danh sách buổi học & tổng hợp điểm danh" description="Nhóm dữ liệu theo từng buổi học, hiển thị số có mặt/vắng/trễ/có phép và danh sách học viên liên quan." accent="sky">
        {groupedSessions.length ? (
          <div className="space-y-4">
            {groupedSessions.map(({ session, records, counts, classEnrollmentCount }) => (
              <div key={session.id} className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="xl:max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-lg font-semibold text-white">{session.courseName ?? `Lớp #${session.courseId}`}</p>
                      <span className="rounded-full bg-sky-400/10 px-3 py-1 text-xs text-sky-200">{sessionStatusLabel[session.status]}</span>
                    </div>
                    <p className="mt-2">{session.sessionDate} • {session.startTime}-{session.endTime}</p>
                    <p className="mt-1 text-slate-400">Chủ đề: {session.topic}</p>
                    <p className="mt-1 text-slate-400">Sĩ số lớp hiện tại: {classEnrollmentCount}</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                      { label: attendanceLabel.present, value: counts.present, tone: "text-emerald-200" },
                      { label: attendanceLabel.absent, value: counts.absent, tone: "text-rose-200" },
                      { label: attendanceLabel.late, value: counts.late, tone: "text-amber-200" },
                      { label: attendanceLabel.excused, value: counts.excused, tone: "text-sky-200" },
                    ].map((item) => (
                      <div key={item.label} className="min-w-32 rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                        <p className={`mt-2 text-2xl font-semibold text-white ${item.tone}`}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {records.length ? (
                    records.map((record) => (
                      <div key={record.id} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium text-white">{record.studentName ?? `Học viên #${record.studentId}`}</p>
                          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">{attendanceLabel[record.status]}</span>
                        </div>
                        <p className="mt-2 text-slate-400">{record.note || "Không có ghi chú."}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400">Buổi này chưa phát sinh bản ghi điểm danh.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-300">Chưa có buổi học thuộc các lớp của giáo viên demo.</p>
        )}
      </SectionCard>
    </TeacherSubpageShell>
  );
}
