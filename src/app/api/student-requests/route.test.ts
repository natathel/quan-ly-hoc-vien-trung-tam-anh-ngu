import { beforeEach, describe, expect, it } from "vitest";

process.env.NODE_ENV = "test";

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
