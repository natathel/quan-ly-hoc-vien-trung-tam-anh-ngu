import { createCourse, listCourses } from "@/lib/database";
import { courseSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function GET() {
  return Response.json({ courses: listCourses() });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = courseSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Dữ liệu lớp học chưa hợp lệ", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const course = createCourse(parsed.data);
    return Response.json({ course }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Không thể tạo lớp học" },
      { status: 500 },
    );
  }
}
