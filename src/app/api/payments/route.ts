import { createPayment, listPayments } from "@/lib/database";
import { paymentSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const invoiceId = searchParams.get("invoiceId");
  return Response.json({ payments: listPayments(invoiceId ? Number(invoiceId) : undefined) });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = paymentSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Dữ liệu thanh toán chưa hợp lệ", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const payment = createPayment(parsed.data);
    return Response.json({ payment }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Không thể tạo thanh toán" },
      { status: 500 },
    );
  }
}
