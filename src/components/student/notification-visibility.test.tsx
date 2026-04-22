import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import { AdminNotificationsPage } from "@/components/admin/admin-notifications-page";
import { StudentPortal } from "@/components/student/student-portal";
import { StudentRequestsPage } from "@/components/student/student-requests-page";
import type { Notification, Student } from "@/lib/types";

const notifications: Notification[] = [
  {
    id: 1,
    audience: "students",
    title: "Thông báo đang hiệu lực",
    message: "Thông báo hiện tại",
    priority: "normal",
    publishedAt: "2026-04-22",
    expiresAt: "2026-04-25",
    createdAt: "2026-04-22",
    updatedAt: "2026-04-22",
  },
  {
    id: 2,
    audience: "students",
    title: "Thông báo đã hết hạn",
    message: "Không nên hiển thị",
    priority: "high",
    publishedAt: "2026-04-10",
    expiresAt: "2026-04-20",
    createdAt: "2026-04-10",
    updatedAt: "2026-04-10",
  },
  {
    id: 3,
    audience: "all",
    title: "Thông báo tương lai",
    message: "Chưa nên hiển thị",
    priority: "critical",
    publishedAt: "2026-04-30",
    expiresAt: null,
    createdAt: "2026-04-22",
    updatedAt: "2026-04-22",
  },
];

const student: Student = {
  id: 1,
  fullName: "Nguyễn Minh Anh",
  phone: "0900000000",
  email: "minhanh@example.com",
  dateOfBirth: "2012-01-01",
  level: "A2",
  status: "active",
  enrollmentDate: "2026-01-01",
  guardianName: "Nguyễn Văn A",
  guardianPhone: "0911111111",
  learningGoal: "Giao tiếp tự tin",
  notes: "",
  createdAt: "2026-01-01",
  updatedAt: "2026-01-01",
};

describe("notification visibility windows", () => {
  it("filters expired and future notifications from student pages", () => {
    vi.setSystemTime(new Date("2026-04-23T00:00:00.000Z"));

    const requestsMarkup = renderToStaticMarkup(
      <StudentRequestsPage students={[student]} requests={[]} notifications={notifications} />,
    );
    const portalMarkup = renderToStaticMarkup(
      <StudentPortal
        students={[student]}
        enrollments={[]}
        sessions={[]}
        attendanceRecords={[]}
        assessments={[]}
        assessmentScores={[]}
        invoices={[]}
        notifications={notifications}
        stats={{
          totalStudents: 1,
          activeStudents: 1,
          activeCourses: 0,
          monthlyRevenue: 0,
          unpaidEnrollments: 0,
          capacityUsage: 0,
          activeTeachers: 0,
          scheduledSessions: 0,
          completedSessions: 0,
          attendanceRate: 0,
          averageScore: 0,
          issuedInvoices: 0,
          overdueInvoices: 0,
          outstandingTuition: 0,
          collectedTuition: 0,
        }}
        summary={{ upcomingSessions: [], recentAssessments: [], openInvoices: [], studentCareList: [] }}
      />,
    );

    expect(requestsMarkup).toContain("Thông báo đang hiệu lực");
    expect(requestsMarkup).not.toContain("Thông báo đã hết hạn");
    expect(requestsMarkup).not.toContain("Thông báo tương lai");
    expect(portalMarkup).toContain("Thông báo đang hiệu lực");
    expect(portalMarkup).not.toContain("Thông báo đã hết hạn");
    expect(portalMarkup).not.toContain("Thông báo tương lai");

    vi.useRealTimers();
  });

  it("counts only active notifications in admin summary cards", () => {
    vi.setSystemTime(new Date("2026-04-23T00:00:00.000Z"));

    const markup = renderToStaticMarkup(<AdminNotificationsPage notifications={notifications} />);

    expect(markup).toContain("Đang hiển thị</p><p class=\"mt-3 text-3xl font-semibold text-emerald-300\">1</p>");
    expect(markup).toContain("Học viên nhìn thấy</p><p class=\"mt-3 text-3xl font-semibold text-violet-300\">1</p>");

    vi.useRealTimers();
  });
});
