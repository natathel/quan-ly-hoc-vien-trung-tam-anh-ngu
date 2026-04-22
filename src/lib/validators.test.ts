import { describe, expect, it } from "vitest";

import { assessmentSchema, courseSchema, invoiceSchema, sessionSchema, studentSchema, teacherSchema } from "./validators";

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
});
