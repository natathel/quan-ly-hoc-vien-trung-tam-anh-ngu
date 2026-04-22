import { createLead, listLeads } from "@/lib/database";
import { leadSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function GET() {
  return Response.json({ leads: listLeads() });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "JSON không hợp lệ" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Dữ liệu lead chưa hợp lệ", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const lead = createLead(parsed.data);
    return Response.json({ lead }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Không thể tạo lead" },
      { status: 500 },
    );
  }
}
