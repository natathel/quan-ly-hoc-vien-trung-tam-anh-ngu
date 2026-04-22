import { createNotification, listNotifications } from "@/lib/database";
import { notificationSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function GET() {
  return Response.json({ notifications: listNotifications() });
}

export async function POST(request: Request) {
  if (request.headers.get("x-center-admin") !== "true") {
    return Response.json({ error: "Cần quyền admin để tạo thông báo" }, { status: 403 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "JSON không hợp lệ" }, { status: 400 });
  }

  const parsed = notificationSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Dữ liệu thông báo chưa hợp lệ", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const notification = createNotification(parsed.data);
    return Response.json({ notification }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Không thể tạo thông báo" },
      { status: 500 },
    );
  }
}
