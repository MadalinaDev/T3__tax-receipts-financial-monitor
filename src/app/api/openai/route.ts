import OpenAI from "openai";
import { NextResponse, type NextRequest } from "next/server";
import type { ReceiptWithProducts } from "~/types/receipt";

type PostRequestType = {
  receipts: ReceiptWithProducts;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as PostRequestType;
  const { receipts } = body;

  const openai = new OpenAI({
    baseURL: "https://api.deepseek.com",
    apiKey: process.env.OPENAI_KEY,
  });

  const response = await openai.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      {
        role: "user",
        content: `Take this list of receipts and return JSON with:
1. SpendingOverTime: line chart data (daily + monthly totals).
2. SpendingByCategory: bar chart data, cluster products into categories (snacks, dairy, bakery, fruits, ice cream, fast food, other).

Receipts: ${JSON.stringify(receipts)}`,
      },
    ],
  });

  return NextResponse.json(response);
}
