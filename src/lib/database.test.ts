import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { beforeEach, describe, expect, it } from "vitest";

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "english-center-"));
process.env.NODE_ENV = "test";
process.env.SQLITE_PATH = path.join(tempRoot, "nested", "test.db");

const databaseModule = await import("./database");

const { createStudent, getDashboardStats, listStudents, resetDatabaseForTests } = databaseModule;

describe("database", () => {
  beforeEach(() => {
    resetDatabaseForTests();
  });

  it("seeds dashboard statistics for the English center", () => {
    const stats = getDashboardStats();

    expect(stats.totalStudents).toBe(3);
    expect(stats.activeStudents).toBe(2);
    expect(stats.activeCourses).toBe(3);
    expect(stats.unpaidEnrollments).toBe(1);
    expect(stats.monthlyRevenue).toBe(3400000);
  });

  it("creates a new student and keeps search working", () => {
    const student = createStudent({
      fullName: "Phạm Hoàng Long",
      phone: "0933444555",
      email: "hoanglong@example.com",
      dateOfBirth: "2012-03-18",
      level: "A2",
      status: "active",
      enrollmentDate: "2026-03-01",
      notes: "Quan tâm lớp giao tiếp cuối tuần.",
    });

    expect(student.id).toBeGreaterThan(0);

    const students = listStudents("Hoàng Long");
    expect(students).toHaveLength(1);
    expect(students[0]?.email).toBe("hoanglong@example.com");
  });
});
