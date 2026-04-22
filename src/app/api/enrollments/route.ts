import { createEnrollment, listEnrollments } from "@/lib/database";
import { enrollmentSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function GET() {
  return Response.json({ enrollments: listEnrollments() });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = enrollmentSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Dữ liệu ghi danh chưa hợp lệ", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const enrollment = createEnrollment(parsed.data);
    return Response.json({ enrollment }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không thể tạo ghi danh";
    return Response.json({ error: message }, { status: 500 });
  }
}
