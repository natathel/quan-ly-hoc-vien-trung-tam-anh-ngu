import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import Database from "better-sqlite3";
import { beforeEach, describe, expect, it } from "vitest";

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "english-center-"));
process.env.NODE_ENV = "test";
process.env.SQLITE_PATH = path.join(tempRoot, "nested", "test.db");

const databaseModule = await import("./database");

const {
  createAssessment,
  createAssessmentScore,
  createInvoice,
  createLead,
  createNotification,
  createPayment,
  createStudentRequest,
  createStudent,
  createTeacher,
  getDashboardStats,
  getOperationalSummary,
  listAssessments,
  listInvoices,
  listLeads,
  listNotifications,
  listStudentRequests,
  listStudents,
  listTeachers,
  resetDatabaseForTests,
} = databaseModule;

describe("database", () => {
  beforeEach(() => {
    resetDatabaseForTests();
  });

  it("seeds expanded dashboard statistics for the English center", () => {
    const stats = getDashboardStats();

    expect(stats.totalStudents).toBe(3);
    expect(stats.activeStudents).toBe(2);
    expect(stats.activeCourses).toBe(3);
    expect(stats.activeTeachers).toBe(2);
    expect(stats.scheduledSessions).toBe(2);
    expect(stats.completedSessions).toBe(1);
    expect(stats.unpaidEnrollments).toBe(1);
    expect(stats.monthlyRevenue).toBe(3400000);
    expect(stats.issuedInvoices).toBe(3);
    expect(stats.overdueInvoices).toBe(1);
    expect(stats.collectedTuition).toBe(2300000);
    expect(stats.outstandingTuition).toBe(3400000);
    expect(stats.averageScore).toBeGreaterThan(0);
  });

  it("creates a new student and keeps search working with guardian data", () => {
    const student = createStudent({
      fullName: "Phạm Hoàng Long",
      phone: "0933444555",
      email: "hoanglong@example.com",
      dateOfBirth: "2012-03-18",
      level: "A2",
      status: "active",
      enrollmentDate: "2026-03-01",
      guardianName: "Phạm Thị Hạnh",
      guardianPhone: "0933000111",
      learningGoal: "Nâng speaking để tham gia câu lạc bộ tiếng Anh.",
      notes: "Quan tâm lớp giao tiếp cuối tuần.",
    });

    expect(student.id).toBeGreaterThan(0);
    expect(student.guardianName).toBe("Phạm Thị Hạnh");

    const students = listStudents("Hoàng Long");
    expect(students).toHaveLength(1);
    expect(students[0]?.email).toBe("hoanglong@example.com");
  });

  it("manages teachers, assessments and scores", () => {
    const teacher = createTeacher({
      fullName: "Lê Minh Khoa",
      email: "khoa.teacher@example.com",
      phone: "0904555666",
      specialization: "IELTS Speaking",
      status: "active",
      hourlyRate: 400000,
      notes: "Có thể nhận lớp cuối tuần.",
    });
    expect(teacher.id).toBeGreaterThan(0);
    expect(listTeachers().some((item) => item.email === "khoa.teacher@example.com")).toBe(true);

    const assessment = createAssessment({
      courseId: 1,
      title: "Grammar Progress Test",
      assessmentType: "quiz",
      assessmentDate: "2026-04-25",
      maxScore: 10,
      weight: 15,
    });
    expect(assessment.courseName).toBe("Starter Kids A1");

    const score = createAssessmentScore({
      assessmentId: assessment.id,
      studentId: 2,
      score: 8.5,
      feedback: "Nắm chắc cấu trúc câu cơ bản.",
    });
    expect(score.score).toBe(8.5);
    expect(listAssessments().find((item) => item.id === assessment.id)?.averageScore).toBe(8.5);
  });

  it("creates invoices, records payments and updates financial dashboard", () => {
    const invoice = createInvoice({
      studentId: 1,
      enrollmentId: 1,
      issueDate: "2026-04-22",
      dueDate: "2026-04-29",
      amount: 1800000,
      discount: 0,
      status: "issued",
      description: "Học phí bổ sung speaking club",
    });

    expect(invoice.invoiceNo).toMatch(/^INV-/);
    expect(invoice.outstandingAmount).toBe(1800000);

    const payment = createPayment({
      invoiceId: invoice.id,
      paymentDate: "2026-04-22",
      amount: 1800000,
      method: "bank_transfer",
      referenceNo: "VCB-0422-001",
      note: "Đã đối soát tự động.",
    });
    expect(payment.id).toBeGreaterThan(0);

    const paidInvoice = listInvoices().find((item) => item.id === invoice.id);
    expect(paidInvoice?.status).toBe("paid");
    expect(paidInvoice?.outstandingAmount).toBe(0);
  });

  it("creates and lists leads for the CRM pipeline", () => {
    const lead = createLead({
      fullName: "Phan Tuệ Nhi",
      phone: "0977665544",
      email: "tuenhi.parent@example.com",
      source: "facebook_ads",
      programInterest: "Tiếng Anh thiếu nhi",
      status: "contacted",
      note: "Phụ huynh muốn học thử trong tuần này.",
    });

    expect(lead.id).toBeGreaterThan(0);
    expect(lead.status).toBe("contacted");
    expect(lead.programInterest).toBe("Tiếng Anh thiếu nhi");

    const leads = listLeads();
    expect(leads[0]?.id).toBe(lead.id);
    expect(leads.some((item) => item.source === "facebook_ads")).toBe(true);
  });

  it("creates and lists student requests for learner support workflows", () => {
    const request = createStudentRequest({
      studentId: 1,
      requestType: "class_transfer",
      title: "Xin chuyển sang lớp tối",
      description: "Em muốn chuyển sang lớp tối thứ 3-5 để phù hợp lịch học.",
      status: "in_progress",
      response: "Đã tiếp nhận và đang kiểm tra sĩ số lớp phù hợp.",
    });

    expect(request.id).toBeGreaterThan(0);
    expect(request.studentId).toBe(1);
    expect(request.studentName).toBe("Nguyễn Minh Anh");
    expect(request.requestType).toBe("class_transfer");
    expect(request.status).toBe("in_progress");

    const requests = listStudentRequests();
    expect(requests[0]?.id).toBe(request.id);
    expect(requests.some((item) => item.studentName === "Nguyễn Minh Anh")).toBe(true);
  });

  it("creates and lists notifications for role-based announcements", () => {
    const notification = createNotification({
      audience: "teachers",
      title: "Cập nhật lịch họp chuyên môn",
      message: "Họp chuyên môn chuyển sang 08:30 sáng thứ 7 tại phòng 2.",
      priority: "high",
      publishedAt: "2026-04-22",
      expiresAt: "2026-04-27",
    });

    expect(notification.id).toBeGreaterThan(0);
    expect(notification.audience).toBe("teachers");
    expect(notification.priority).toBe("high");
    expect(notification.publishedAt).toBe("2026-04-22");
    expect(notification.expiresAt).toBe("2026-04-27");

    const notifications = listNotifications();
    expect(notifications[0]?.id).toBe(notification.id);
    expect(notifications.some((item) => item.title === "Cập nhật lịch họp chuyên môn")).toBe(true);
  });

  it("upgrades a legacy database by adding lead support without breaking existing data", async () => {
    const legacyRoot = fs.mkdtempSync(path.join(os.tmpdir(), "english-center-legacy-leads-"));
    const legacyPath = path.join(legacyRoot, "legacy-leads.db");
    const legacyDb = new Database(legacyPath);

    legacyDb.exec(`
      CREATE TABLE students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        date_of_birth TEXT NOT NULL,
        level TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'active',
        enrollment_date TEXT NOT NULL,
        notes TEXT NOT NULL DEFAULT '',
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        guardian_name TEXT NOT NULL DEFAULT '',
        guardian_phone TEXT NOT NULL DEFAULT '',
        learning_goal TEXT NOT NULL DEFAULT ''
      );

      CREATE TABLE courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        level TEXT NOT NULL,
        teacher TEXT NOT NULL,
        schedule TEXT NOT NULL,
        monthly_fee INTEGER NOT NULL DEFAULT 0,
        capacity INTEGER NOT NULL DEFAULT 12,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    legacyDb.close();

    const originalSqlitePath = process.env.SQLITE_PATH;
    process.env.SQLITE_PATH = legacyPath;

    expect(listLeads()).toEqual([]);

    const migratedLead = createLead({
      fullName: "Lưu Gia Bảo",
      phone: "0908111222",
      email: "giabao.parent@example.com",
      source: "landing_page",
      programInterest: "IELTS Foundation",
      status: "new",
      note: "Đăng ký từ form website.",
    });

    expect(migratedLead.id).toBeGreaterThan(0);
    expect(listStudents()).toEqual([]);
    expect(listLeads()).toHaveLength(1);

    process.env.SQLITE_PATH = originalSqlitePath;
    resetDatabaseForTests();
  });

  it("returns operational summary for leadership dashboard", () => {
    const summary = getOperationalSummary();

    expect(summary.upcomingSessions.length).toBeGreaterThan(0);
    expect(summary.recentAssessments.length).toBeGreaterThan(0);
    expect(summary.openInvoices.length).toBeGreaterThan(0);
    expect(summary.studentCareList.length).toBeGreaterThan(0);
  });

  it("upgrades a legacy demo database that only has students and courses", async () => {
    const legacyRoot = fs.mkdtempSync(path.join(os.tmpdir(), "english-center-legacy-"));
    const legacyPath = path.join(legacyRoot, "legacy.db");
    const legacyDb = new Database(legacyPath);

    legacyDb.exec(`
      CREATE TABLE students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        date_of_birth TEXT NOT NULL,
        level TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'active',
        enrollment_date TEXT NOT NULL,
        notes TEXT NOT NULL DEFAULT '',
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        guardian_name TEXT NOT NULL DEFAULT '',
        guardian_phone TEXT NOT NULL DEFAULT '',
        learning_goal TEXT NOT NULL DEFAULT ''
      );

      CREATE TABLE courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        level TEXT NOT NULL,
        teacher TEXT NOT NULL,
        schedule TEXT NOT NULL,
        monthly_fee INTEGER NOT NULL DEFAULT 0,
        capacity INTEGER NOT NULL DEFAULT 12,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const insertLegacyStudent = legacyDb.prepare(
      `INSERT INTO students (full_name, phone, email, date_of_birth, level, status, enrollment_date, guardian_name, guardian_phone, learning_goal, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    );

    insertLegacyStudent.run(
      "Nguyễn Minh Anh",
      "0901234567",
      "minhanh@example.com",
      "2011-05-12",
      "A2",
      "active",
      "2026-01-05",
      "Nguyễn Thị Hồng",
      "0903000111",
      "Tăng phản xạ giao tiếp để thi Cambridge Movers.",
      "Cần luyện thêm speaking.",
    );
    insertLegacyStudent.run(
      "Trần Gia Hân",
      "0912222333",
      "giahan@example.com",
      "2012-09-03",
      "A1",
      "active",
      "2026-02-10",
      "Trần Văn Dũng",
      "0912000222",
      "Xây nền ngữ pháp và từ vựng tiểu học.",
      "Phụ huynh muốn nhận báo cáo hàng tháng.",
    );
    insertLegacyStudent.run(
      "Lê Quốc Bảo",
      "0988888123",
      "quocbao@example.com",
      "2010-11-24",
      "B1",
      "paused",
      "2025-11-15",
      "Lê Thị Mai",
      "0988000123",
      "Đạt 5.5 IELTS Foundation.",
      "Tạm nghỉ 2 tuần vì lịch thi ở trường.",
    );

    legacyDb.prepare(
      `INSERT INTO courses (name, level, teacher, schedule, monthly_fee, capacity)
       VALUES (?, ?, ?, ?, ?, ?)`,
    ).run("Starter Kids A1", "A1", "Nguyễn Khánh Linh", "Thứ 2-4, 18:00-19:30", 1600000, 12);
    legacyDb.prepare(
      `INSERT INTO courses (name, level, teacher, schedule, monthly_fee, capacity)
       VALUES (?, ?, ?, ?, ?, ?)`,
    ).run("Communication A2", "A2", "David Tran", "Thứ 3-5, 19:00-20:30", 1800000, 10);
    legacyDb.prepare(
      `INSERT INTO courses (name, level, teacher, schedule, monthly_fee, capacity)
       VALUES (?, ?, ?, ?, ?, ?)`,
    ).run("IELTS Foundation B1", "B1", "Trần Thu Trang", "Thứ 7-CN, 09:00-11:00", 2400000, 14);
    legacyDb.close();

    const originalSqlitePath = process.env.SQLITE_PATH;
    process.env.SQLITE_PATH = legacyPath;
    const stats = getDashboardStats();

    expect(listStudents()).toHaveLength(3);
    expect(listTeachers()).toEqual([]);
    expect(databaseModule.listSessions()).toEqual([]);
    expect(listAssessments()).toEqual([]);
    expect(listInvoices()).toEqual([]);
    expect(stats.activeTeachers).toBe(0);
    expect(stats.scheduledSessions).toBe(0);

    process.env.SQLITE_PATH = originalSqlitePath;
    resetDatabaseForTests();
  });
});
