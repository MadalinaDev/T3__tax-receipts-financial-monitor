import { NextResponse, type NextRequest } from "next/server";
import type { ReceiptWithProducts } from "~/types/receipt";
import { categorizeProductsWithOpenAI } from "~/lib/productsCategorization";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { receipts: ReceiptWithProducts[] };
  const { receipts } = body;

  const result = await categorizeProductsWithOpenAI(receipts);
  return NextResponse.json(result);
}
