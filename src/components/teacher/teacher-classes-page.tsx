import { SectionCard } from "@/components/shared/section-card";
import type { AttendanceRecord, Course, Enrollment, Session, Student, Teacher } from "@/lib/types";

import {
  attendanceLabel,
  countAttendance,
  formatCurrency,
  getCourseStudentCount,
  getCurrentTeacherContext,
  getTeacherAttendanceRecords,
  getTeacherSessions,
  getTeacherStudents,
  sessionStatusLabel,
  teacherStatusLabel,
} from "./teacher-portal-utils";
import { TeacherSubpageShell } from "./teacher-subpage-shell";

type TeacherClassesPageProps = {
  teachers: Teacher[];
  courses: Course[];
  enrollments: Enrollment[];
  sessions: Session[];
  attendanceRecords: AttendanceRecord[];
  students: Student[];
};

export function TeacherClassesPage({
  teachers,
  courses,
  enrollments,
  sessions,
  attendanceRecords,
  students,
}: TeacherClassesPageProps) {
  const { teacher, assignedCourses, assignedCourseIds } = getCurrentTeacherContext({ teachers, courses });
  const teacherSessions = getTeacherSessions({ sessions, assignedCourseIds });
  const teacherAttendanceRecords = getTeacherAttendanceRecords({ attendanceRecords, teacherSessions });
  const teacherStudents = getTeacherStudents({ students, enrollments, assignedCourseIds });

  const courseCards = assignedCourses.map((course) => {
    const courseSessions = teacherSessions.filter((session) => session.courseId === course.id);
    const latestSession = [...courseSessions].sort((a, b) => `${b.sessionDate} ${b.startTime}`.localeCompare(`${a.sessionDate} ${a.startTime}`))[0];

    return {
      course,
      studentCount: getCourseStudentCount(course.id, enrollments),
      totalSessions: courseSessions.length,
      latestSession,
    };
  });

  const recentAndUpcomingSessions = [...teacherSessions]
    .sort((a, b) => `${b.sessionDate} ${b.startTime}`.localeCompare(`${a.sessionDate} ${a.startTime}`))
    .slice(0, 6)
    .map((session) => {
      const sessionAttendance = teacherAttendanceRecords.filter((record) => record.sessionId === session.id);
      return {
        session,
        attendanceCounts: countAttendance(sessionAttendance),
      };
    });

  return (
    <TeacherSubpageShell
      activeHref="/teacher/classes"
      title={teacher ? `Lớp phụ trách của ${teacher.fullName}` : "Lớp phụ trách giáo viên demo"}
      description="Tổng hợp hồ sơ giáo viên demo, danh sách lớp đang phụ trách, quy mô học viên và các buổi học liên quan. Các nút thao tác chỉ là UI minh hoạ cho phase 2."
    >
      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionCard title="Tóm tắt giáo viên" description="Chọn giáo viên active đầu tiên, nếu không có thì lấy giáo viên đầu danh sách." accent="emerald">
          {teacher ? (
            <div className="space-y-4 text-sm text-slate-300">
              <div>
                <p className="text-xl font-semibold text-white">{teacher.fullName}</p>
                <p className="mt-1">{teacher.specialization} • {teacherStatusLabel[teacher.status]}</p>
                <p className="mt-1">{teacher.phone} • {teacher.email}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Số lớp</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{assignedCourses.length}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Học viên phụ trách</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{teacherStudents.length}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Số buổi liên quan</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{teacherSessions.length}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-medium text-white">Ghi chú vận hành</p>
                <p className="mt-2 leading-6">{teacher.notes || "Chưa có ghi chú."}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-300">Chưa có giáo viên demo.</p>
          )}
        </SectionCard>

        <SectionCard title="Thao tác nhanh" description="Nhóm hành động minh hoạ dành cho điều phối lớp học; chưa ghi nhận dữ liệu thật." accent="sky">
          <div className="grid gap-3 text-sm">
            {[
              {
                title: "Mở điểm danh",
                description: "Đi tới panel điểm danh để chuẩn bị xác nhận có mặt/vắng/trễ cho buổi dạy gần nhất.",
              },
              {
                title: "Gửi thông báo lớp",
                description: "Mở giao diện nháp thông báo tới học viên/phụ huynh của từng lớp phụ trách.",
              },
              {
                title: "Xem học viên",
                description: "Truy cập danh sách học viên đang ghi danh theo lớp để theo dõi hỗ trợ học tập.",
              },
            ].map((action) => (
              <button
                key={action.title}
                type="button"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left transition hover:border-emerald-400/30 hover:text-emerald-200"
              >
                <p className="font-medium text-white">{action.title}</p>
                <p className="mt-1 text-slate-400">{action.description}</p>
              </button>
            ))}
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard title="Danh sách lớp phụ trách" description="Chỉ hiển thị các lớp có teacher trùng với giáo viên demo hiện tại." accent="violet">
          {courseCards.length ? (
            <div className="space-y-3">
              {courseCards.map(({ course, studentCount, totalSessions, latestSession }) => (
                <div key={course.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-white">{course.name}</p>
                      <p className="mt-2">Trình độ: {course.level}</p>
                      <p className="mt-1">Lịch học: {course.schedule}</p>
                      <p className="mt-1">Học phí chuẩn: {formatCurrency(course.monthlyFee)}</p>
                    </div>
                    <div className="min-w-52 rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                      <p>Sĩ số hiện tại: <span className="font-semibold text-white">{studentCount}/{course.capacity}</span></p>
                      <p className="mt-1">Số buổi đã lên lịch: <span className="font-semibold text-white">{totalSessions}</span></p>
                      <p className="mt-1">Trạng thái lớp: <span className="font-semibold text-emerald-200">Đang phụ trách</span></p>
                    </div>
                  </div>
                  <div className="mt-3 rounded-2xl border border-white/10 bg-slate-950/50 p-3 text-slate-400">
                    <p className="font-medium text-white">Buổi gần nhất / liên quan</p>
                    <p className="mt-1">
                      {latestSession
                        ? `${latestSession.sessionDate} • ${latestSession.startTime}-${latestSession.endTime} • ${latestSession.topic}`
                        : "Chưa có buổi học nào cho lớp này."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-300">Không có lớp nào khớp với giáo viên demo.</p>
          )}
        </SectionCard>

        <SectionCard title="Học viên đang phụ trách" description="Danh sách gọn học viên thuộc các lớp của giáo viên demo." accent="amber">
          {teacherStudents.length ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {teacherStudents.map((student) => (
                <div key={student.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  <p className="font-semibold text-white">{student.fullName}</p>
                  <p className="mt-2">Trình độ: {student.level}</p>
                  <p className="mt-1">Liên hệ: {student.phone}</p>
                  <p className="mt-1 text-slate-400">Mục tiêu: {student.learningGoal || "Chưa cập nhật"}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-300">Chưa có học viên thuộc các lớp phụ trách.</p>
          )}
        </SectionCard>
      </section>

      <SectionCard title="Buổi học gần đây / sắp tới" description="Chỉ lấy các buổi học thuộc lớp của giáo viên demo, tránh lẫn buổi không liên quan." accent="rose">
        {recentAndUpcomingSessions.length ? (
          <div className="space-y-3">
            {recentAndUpcomingSessions.map(({ session, attendanceCounts }) => (
              <div key={session.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-white">{session.courseName ?? `Lớp #${session.courseId}`}</p>
                      <span className="rounded-full bg-rose-400/10 px-3 py-1 text-xs text-rose-200">{sessionStatusLabel[session.status]}</span>
                    </div>
                    <p className="mt-2">{session.sessionDate} • {session.startTime}-{session.endTime}</p>
                    <p className="mt-1 text-slate-400">Chủ đề: {session.topic}</p>
                    <p className="mt-1 text-slate-400">Bài tập về nhà: {session.homework || "Chưa cập nhật"}</p>
                  </div>
                  <div className="min-w-60 rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                    <p className="font-medium text-white">Tóm tắt điểm danh</p>
                    <p className="mt-2">{attendanceLabel.present}: {attendanceCounts.present}</p>
                    <p className="mt-1">{attendanceLabel.absent}: {attendanceCounts.absent}</p>
                    <p className="mt-1">{attendanceLabel.late}: {attendanceCounts.late}</p>
                    <p className="mt-1">{attendanceLabel.excused}: {attendanceCounts.excused}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-300">Chưa có buổi học nào thuộc các lớp giáo viên demo.</p>
        )}
      </SectionCard>
    </TeacherSubpageShell>
  );
}
