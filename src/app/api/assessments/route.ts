import { createAssessment, listAssessments } from "@/lib/database";
import { assessmentSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function GET() {
  return Response.json({ assessments: listAssessments() });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = assessmentSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Dữ liệu bài kiểm tra chưa hợp lệ", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const assessment = createAssessment(parsed.data);
    return Response.json({ assessment }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Không thể tạo bài kiểm tra" },
      { status: 500 },
    );
  }
}
