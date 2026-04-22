import { createSession, listSessions } from "@/lib/database";
import { sessionSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function GET() {
  return Response.json({ sessions: listSessions() });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = sessionSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Dữ liệu buổi học chưa hợp lệ", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const session = createSession(parsed.data);
    return Response.json({ session }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Không thể tạo buổi học" },
      { status: 500 },
    );
  }
}
