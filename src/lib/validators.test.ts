import { describe, expect, it } from "vitest";

import { courseSchema, studentSchema } from "./validators";

describe("validators", () => {
  it("accepts valid student payloads", () => {
    const result = studentSchema.safeParse({
      fullName: "Nguyễn Thu Hà",
      phone: "0909888777",
      email: "thuha@example.com",
      dateOfBirth: "2011-06-20",
      level: "B1",
      status: "active",
      enrollmentDate: "2026-04-01",
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
});
