import { createStudent, listStudents } from "@/lib/database";
import { studentSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";

  return Response.json({ students: listStudents(query) });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = studentSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Dữ liệu học viên chưa hợp lệ", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const student = createStudent(parsed.data);
    return Response.json({ student }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Không thể tạo học viên" },
      { status: 500 },
    );
  }
}
