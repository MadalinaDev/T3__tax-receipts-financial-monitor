import OpenAI from "openai";
import { NextResponse, type NextRequest } from "next/server";
import type { ReceiptWithProducts } from "~/types/receipt";

type PostRequestType = {
  receipts: ReceiptWithProducts[];
};

const preprocessReceipts = (receipts: ReceiptWithProducts[]) => {
  return receipts.map((r) => ({
    dateTime: r.dateTime,
    location: r.location,
    total: r.total,
    companyName: r.companyName,
    products: r.products.map((p) => ({
      name: p.name,
      qunatity: p.quantity,
      totalPrice: p.totalPrice,
    })),
  }))
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as PostRequestType;
  const { receipts } = body;

  const preprocessedReceipts = preprocessReceipts(receipts);

  const openai = new OpenAI({
    baseURL: "https://api.deepseek.com",
    apiKey: process.env.OPENAI_KEY,
  });

    const response = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "user",
          content: `Take this list of receipts and return only JSON with:
  1. SpendingOverTime: line chart data (daily + monthly totals).
  2. SpendingByCategory: bar chart data, cluster products into categories (snacks, dairy, bakery, fruits, ice cream, fast food, other).

  Receipts: ${JSON.stringify(preprocessedReceipts)}`,
        },
      ],
    });

  return NextResponse.json(response);
}
