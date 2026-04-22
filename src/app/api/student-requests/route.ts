import Database from "better-sqlite3";

import { createStudentRequest, getStudent, listStudentRequests } from "@/lib/database";
import { studentRequestSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function GET() {
  return Response.json({ requests: listStudentRequests() });
}

export async function POST(request: Request) {
  let body: unknown;
  let returnTo: string | null = null;

  try {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const formBody: Record<string, FormDataEntryValue> = {};
      formData.forEach((value, key) => {
        formBody[key] = value;
      });
      body = formBody;
      const rawReturnTo = formData.get("returnTo");
      returnTo = typeof rawReturnTo === "string"
        && rawReturnTo.startsWith("/")
        && !rawReturnTo.startsWith("//")
        ? rawReturnTo
        : null;
    } else {
      body = await request.json();
    }
  } catch {
    return Response.json({ error: "JSON không hợp lệ" }, { status: 400 });
  }

  const parsed = studentRequestSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Dữ liệu yêu cầu học viên chưa hợp lệ", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    getStudent(parsed.data.studentId);
    const requestItem = createStudentRequest(parsed.data);

    if (returnTo) {
      return Response.redirect(new URL(returnTo, request.url), 303);
    }

    return Response.json({ request: requestItem }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Không tìm thấy học viên") {
      return Response.json({ error: error.message }, { status: 404 });
    }

    if (error instanceof Database.SqliteError) {
      return Response.json({ error: "Không thể tạo yêu cầu học viên" }, { status: 400 });
    }

    return Response.json(
      { error: error instanceof Error ? error.message : "Không thể tạo yêu cầu học viên" },
      { status: 500 },
    );
  }
}
