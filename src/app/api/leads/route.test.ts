import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { beforeEach, describe, expect, it } from "vitest";

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "english-center-leads-"));
process.env.NODE_ENV = "test";
process.env.SQLITE_PATH = path.join(tempRoot, "test.db");

const { resetDatabaseForTests } = await import("@/lib/database");
const { GET, POST } = await import("./route");

describe("/api/leads route", () => {
  beforeEach(() => {
    resetDatabaseForTests();
  });

  it("returns leads from GET", async () => {
    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ leads: [] });
  });

  it("creates a lead on valid POST", async () => {
    const response = await POST(
      new Request("http://localhost/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullName: "Phan Tuệ Nhi",
          phone: "0977665544",
          email: "tuenhi.parent@example.com",
          source: "facebook_ads",
          programInterest: "Tiếng Anh thiếu nhi",
          status: "contacted",
          note: "Phụ huynh muốn học thử trong tuần này.",
        }),
      }),
    );

    expect(response.status).toBe(201);

    const payload = (await response.json()) as {
      lead: {
        id: number;
        fullName: string;
        status: string;
        programInterest: string;
      };
    };

    expect(payload.lead.id).toBeGreaterThan(0);
    expect(payload.lead.fullName).toBe("Phan Tuệ Nhi");
    expect(payload.lead.status).toBe("contacted");
    expect(payload.lead.programInterest).toBe("Tiếng Anh thiếu nhi");
  });

  it("returns validation details for invalid POST payload", async () => {
    const response = await POST(
      new Request("http://localhost/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullName: "A",
          phone: "123",
          email: "not-an-email",
          source: "",
          programInterest: "",
        }),
      }),
    );

    expect(response.status).toBe(400);

    const payload = (await response.json()) as {
      error: string;
      details: Record<string, string[]>;
    };

    expect(payload.error).toBe("Dữ liệu lead chưa hợp lệ");
    expect(payload.details.fullName).toBeDefined();
    expect(payload.details.phone).toBeDefined();
    expect(payload.details.email).toBeDefined();
    expect(payload.details.source).toBeDefined();
    expect(payload.details.programInterest).toBeDefined();
  });

  it("returns structured JSON error for malformed POST JSON", async () => {
    const response = await POST(
      new Request("http://localhost/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{invalid-json",
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "JSON không hợp lệ" });
  });
});