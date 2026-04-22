import { createInvoice, listInvoices } from "@/lib/database";
import { invoiceSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function GET() {
  return Response.json({ invoices: listInvoices() });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = invoiceSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Dữ liệu chứng từ chưa hợp lệ", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const invoice = createInvoice(parsed.data);
    return Response.json({ invoice }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Không thể tạo chứng từ" },
      { status: 500 },
    );
  }
}
