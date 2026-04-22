import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { beforeEach, describe, expect, it } from "vitest";

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "english-center-notifications-"));
process.env.NODE_ENV = "test";
process.env.SQLITE_PATH = path.join(tempRoot, "test.db");

const { resetDatabaseForTests } = await import("@/lib/database");
const { GET, POST } = await import("./route");

describe("/api/notifications route", () => {
  beforeEach(() => {
    resetDatabaseForTests();
  });

  it("returns notifications from GET", async () => {
    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ notifications: [] });
  });

  it("requires admin header for POST", async () => {
    const response = await POST(
      new Request("http://localhost/api/notifications", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          audience: "students",
          title: "Nhắc nộp học phí tháng 5",
          message: "Anh/chị vui lòng hoàn tất học phí trước ngày 05/05.",
          priority: "high",
        }),
      }),
    );

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: "Cần quyền admin để tạo thông báo" });
  });

  it("creates a notification on valid admin POST", async () => {
    const response = await POST(
      new Request("http://localhost/api/notifications", {
        method: "POST",
        headers: { "content-type": "application/json", "x-center-admin": "true" },
        body: JSON.stringify({
          audience: "students",
          title: "Nhắc nộp học phí tháng 5",
          message: "Anh/chị vui lòng hoàn tất học phí trước ngày 05/05.",
          priority: "high",
          expiresAt: "2026-05-05",
        }),
      }),
    );

    expect(response.status).toBe(201);

    const payload = (await response.json()) as {
      notification: {
        id: number;
        audience: string;
        title: string;
        priority: string;
        publishedAt: string;
        expiresAt: string | null;
      };
    };

    expect(payload.notification.id).toBeGreaterThan(0);
    expect(payload.notification.audience).toBe("students");
    expect(payload.notification.title).toBe("Nhắc nộp học phí tháng 5");
    expect(payload.notification.priority).toBe("high");
    expect(payload.notification.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(payload.notification.expiresAt).toBe("2026-05-05");
  });

  it("returns validation details for invalid POST payload", async () => {
    const response = await POST(
      new Request("http://localhost/api/notifications", {
        method: "POST",
        headers: { "content-type": "application/json", "x-center-admin": "true" },
        body: JSON.stringify({
          audience: "parents",
          title: "A",
          message: "",
          priority: "urgent",
        }),
      }),
    );

    expect(response.status).toBe(400);

    const payload = (await response.json()) as {
      error: string;
      details: Record<string, string[]>;
    };

    expect(payload.error).toBe("Dữ liệu thông báo chưa hợp lệ");
    expect(payload.details.audience).toBeDefined();
    expect(payload.details.title).toBeDefined();
    expect(payload.details.message).toBeDefined();
    expect(payload.details.priority).toBeDefined();
  });

  it("returns structured JSON error for malformed POST JSON", async () => {
    const response = await POST(
      new Request("http://localhost/api/notifications", {
        method: "POST",
        headers: { "content-type": "application/json", "x-center-admin": "true" },
        body: "{invalid-json",
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "JSON không hợp lệ" });
  });
});
