import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { beforeEach, describe, expect, it } from "vitest";

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "english-center-student-requests-"));
process.env.NODE_ENV = "test";
process.env.SQLITE_PATH = path.join(tempRoot, "test.db");

const { resetDatabaseForTests } = await import("@/lib/database");
const { GET, POST } = await import("./route");

describe("/api/student-requests route", () => {
  beforeEach(() => {
    resetDatabaseForTests();
  });

  it("returns student requests from GET", async () => {
    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ requests: [] });
  });

  it("creates a student request on valid POST", async () => {
    const response = await POST(
      new Request("http://localhost/api/student-requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          studentId: 1,
          requestType: "schedule_change",
          title: "Xin đổi lịch học IELTS",
          description: "Phụ huynh muốn chuyển lịch học sang cuối tuần.",
          response: "",
        }),
      }),
    );

    expect(response.status).toBe(201);

    const payload = (await response.json()) as {
      request: {
        id: number;
        studentId: number;
        studentName: string;
        requestType: string;
        status: string;
        title: string;
      };
    };

    expect(payload.request.id).toBeGreaterThan(0);
    expect(payload.request.studentId).toBe(1);
    expect(payload.request.studentName).toBe("Nguyễn Minh Anh");
    expect(payload.request.requestType).toBe("schedule_change");
    expect(payload.request.status).toBe("open");
    expect(payload.request.title).toBe("Xin đổi lịch học IELTS");
  });

  it("redirects form submissions back to the student requests page", async () => {
    const response = await POST(
      new Request("http://localhost/api/student-requests", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          studentId: "1",
          requestType: "academic",
          title: "Hỗ trợ bài tập speaking",
          description: "Em cần giáo viên hướng dẫn thêm bài speaking cuối tuần.",
          returnTo: "/student/requests?submitted=1",
        }),
      }),
    );

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("http://localhost/student/requests?submitted=1");

    const verifyResponse = await GET();
    const payload = (await verifyResponse.json()) as { requests: Array<{ studentId: number; requestType: string; status: string }> };
    expect(payload.requests).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          studentId: 1,
          requestType: "academic",
          status: "open",
        }),
      ]),
    );
  });

  it("ignores protocol-relative return targets from form submissions", async () => {
    const response = await POST(
      new Request("http://localhost/api/student-requests", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          studentId: "1",
          requestType: "support",
          title: "Cần hỗ trợ tài khoản",
          description: "Phụ huynh cần trung tâm gọi lại.",
          returnTo: "//evil.com/phish",
        }),
      }),
    );

    expect(response.status).toBe(201);
    expect(response.headers.get("location")).toBeNull();

    const payload = (await response.json()) as { request: { studentId: number; requestType: string; status: string } };
    expect(payload.request.studentId).toBe(1);
    expect(payload.request.requestType).toBe("support");
    expect(payload.request.status).toBe("open");
  });

  it("returns validation details for invalid POST payload", async () => {
    const response = await POST(
      new Request("http://localhost/api/student-requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          studentId: 0,
          requestType: "wrong_type",
          title: "A",
          description: "",
        }),
      }),
    );

    expect(response.status).toBe(400);

    const payload = (await response.json()) as {
      error: string;
      details: Record<string, string[]>;
    };

    expect(payload.error).toBe("Dữ liệu yêu cầu học viên chưa hợp lệ");
    expect(payload.details.studentId).toBeDefined();
    expect(payload.details.requestType).toBeDefined();
    expect(payload.details.title).toBeDefined();
    expect(payload.details.description).toBeDefined();
  });

  it("returns 404 when the request references a student that does not exist", async () => {
    const response = await POST(
      new Request("http://localhost/api/student-requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          studentId: 999,
          requestType: "support",
          title: "Xin hỗ trợ tài khoản",
          description: "Không đăng nhập được cổng học viên.",
        }),
      }),
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({ error: "Không tìm thấy học viên" });
  });

  it("returns structured JSON error for malformed POST JSON", async () => {
    const response = await POST(
      new Request("http://localhost/api/student-requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{invalid-json",
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "JSON không hợp lệ" });
  });
});
