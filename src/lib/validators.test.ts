import { describe, expect, it } from "vitest";

import {
  assessmentSchema,
  courseSchema,
  invoiceSchema,
  leadSchema,
  sessionSchema,
  studentRequestSchema,
  studentSchema,
  teacherSchema,
} from "./validators";

describe("validators", () => {
  it("accepts valid student payloads with guardian and learning goal", () => {
    const result = studentSchema.safeParse({
      fullName: "Nguyễn Thu Hà",
      phone: "0909888777",
      email: "thuha@example.com",
      dateOfBirth: "2011-06-20",
      level: "B1",
      status: "active",
      enrollmentDate: "2026-04-01",
      guardianName: "Nguyễn Văn Nam",
      guardianPhone: "0909000111",
      learningGoal: "Đạt B1 speaking trong 6 tháng.",
      notes: "Yêu thích lớp speaking.",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid monthly fee for a course", () => {
    const result = courseSchema.safeParse({
      name: "Grammar Intensive",
      level: "B2",
      teacher: "Ms. Hoa",
      schedule: "Thứ 7, 14:00-16:00",
      monthlyFee: -1000,
      capacity: 12,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.monthlyFee).toBeTruthy();
    }
  });

  it("accepts valid teacher and session payloads", () => {
    const teacher = teacherSchema.safeParse({
      fullName: "Trần Minh Anh",
      email: "minhanh.teacher@example.com",
      phone: "0901234567",
      specialization: "Cambridge Young Learners",
      status: "active",
      hourlyRate: 300000,
      notes: "Ưu tiên ca tối.",
    });

    const session = sessionSchema.safeParse({
      courseId: 1,
      teacherId: 1,
      sessionDate: "2026-04-22",
      startTime: "18:00",
      endTime: "19:30",
      topic: "Starter speaking practice",
      homework: "Workbook unit 4",
      status: "scheduled",
    });

    expect(teacher.success).toBe(true);
    expect(session.success).toBe(true);
  });

  it("validates assessment payloads and rejects invalid weight", () => {
    const valid = assessmentSchema.safeParse({
      courseId: 1,
      title: "Speaking Progress Check",
      assessmentType: "speaking",
      assessmentDate: "2026-04-22",
      maxScore: 100,
      weight: 20,
    });

    const invalid = assessmentSchema.safeParse({
      courseId: 1,
      title: "Bad Test",
      assessmentType: "quiz",
      assessmentDate: "2026-04-22",
      maxScore: 10,
      weight: 150,
    });

    expect(valid.success).toBe(true);
    expect(invalid.success).toBe(false);
  });

  it("validates invoice payloads and rejects non-positive amount", () => {
    const valid = invoiceSchema.safeParse({
      studentId: 1,
      enrollmentId: 1,
      issueDate: "2026-04-22",
      dueDate: "2026-04-30",
      amount: 1800000,
      discount: 100000,
      status: "issued",
      description: "Học phí tháng 4",
    });

    const invalid = invoiceSchema.safeParse({
      studentId: 1,
      issueDate: "2026-04-22",
      dueDate: "2026-04-30",
      amount: 0,
      status: "issued",
      description: "Học phí tháng 4",
    });

    expect(valid.success).toBe(true);
    expect(invalid.success).toBe(false);
  });

  it("accepts valid lead payloads and defaults status to new", () => {
    const result = leadSchema.safeParse({
      fullName: "Nguyễn Hoài Thương",
      phone: "0912345678",
      email: "thuong.parent@example.com",
      source: "landing_page",
      programInterest: "IELTS Foundation",
      note: "Muốn được tư vấn lớp cuối tuần.",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("new");
      expect(result.data.note).toBe("Muốn được tư vấn lớp cuối tuần.");
    }
  });

  it("rejects invalid lead payloads with Vietnamese field errors", () => {
    const result = leadSchema.safeParse({
      fullName: "A",
      phone: "123",
      email: "sai-email",
      source: "",
      programInterest: "",
      status: "invalid",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      expect(fieldErrors.fullName).toContain("Họ tên phải có ít nhất 2 ký tự");
      expect(fieldErrors.phone).toContain("Số điện thoại chưa hợp lệ");
      expect(fieldErrors.email).toContain("Email chưa hợp lệ");
      expect(fieldErrors.source).toContain("Vui lòng nhập nguồn lead");
      expect(fieldErrors.programInterest).toContain("Vui lòng nhập chương trình quan tâm");
      expect(fieldErrors.status).toBeTruthy();
    }
  });

  it("accepts valid student request payloads and defaults status to open", () => {
    const result = studentRequestSchema.safeParse({
      studentId: 1,
      requestType: "class_transfer",
      title: "Xin chuyển sang lớp tối thứ 3-5",
      description: "Em muốn chuyển sang lớp buổi tối để phù hợp lịch học ở trường.",
      response: "",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("open");
      expect(result.data.response).toBe("");
    }
  });

  it("rejects invalid student request payloads with field errors", () => {
    const result = studentRequestSchema.safeParse({
      studentId: 0,
      requestType: "wrong_type",
      title: "A",
      description: "",
      status: "unknown",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      expect(fieldErrors.studentId).toContain("Vui lòng chọn học viên");
      expect(fieldErrors.requestType).toBeTruthy();
      expect(fieldErrors.title).toContain("Tiêu đề yêu cầu phải có ít nhất 2 ký tự");
      expect(fieldErrors.description).toContain("Vui lòng nhập nội dung yêu cầu");
      expect(fieldErrors.status).toBeTruthy();
    }
  });
});
