import OpenAI from "openai";
import { NextResponse, type NextRequest } from "next/server";
import type { ReceiptWithProducts } from "~/types/receipt";
import { CATEGORIES } from "~/lib/constants";
import { updateProducts } from "~/server/api/routers/products";
import { type ProductsTableType } from "~/server/db/schema/products";

type PostRequestType = {
  receipts: ReceiptWithProducts[];
};
type ProductsCategoriesMapperType = Record<string, string[]>;

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: ProductsTableType[];
  tokens?: number;
}

// preprocessing --> will take products from each receipt
// and filter those products that don't have a category assigned to them yet
const preprocessReceipts = (receipts: ReceiptWithProducts[]) => {
  if (!receipts || !Array.isArray(receipts)) return [];
  const products: { id: string; name: string }[] = [];
  receipts.forEach((r) => {
    r.products
      .filter((p) => p.category === null)
      .forEach((p) => {
        products.push({
          id: p.id,
          name: p.name,
        });
      });
  });
  return products;
};

// postprocessing --> will make the necessary updates in the DB
// for the respective products' categories
// + update the aggregated info (summary of products categorizations PER receipt)
const postprocessReceipts = async (
  categoriesMapper: ProductsCategoriesMapperType,
) => {
  if (!categoriesMapper || typeof categoriesMapper !== "object") {
    throw new Error("Invalid categories mapper");
  }
  const results = [];
  for (const [category, ids] of Object.entries(categoriesMapper)) {
    if (!Array.isArray(ids)) continue;

    for (const id of ids) {
      results.push({
        id,
        category,
      });
    }
  }
  const updatedProducts = await updateProducts(results);
  return updatedProducts;
};

// this call to openAI will receive
// -> a list of products from user's receipts,
// -> specifically filter the products that haven't been categorized yet
// and then it will return
// -> the categories each of the products belongs to
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PostRequestType;
    const { receipts } = body;

    const listOfUncategorizedProducts = preprocessReceipts(receipts);

    const totalProducts = listOfUncategorizedProducts.flat().length;
    if (totalProducts === 0) {
      const errorNoProducts: ApiResponse = {
        success: false,
        message: "No uncategorized products found",
      };
      return NextResponse.json(errorNoProducts);
    }

    const openai = new OpenAI({
      baseURL: "https://api.deepseek.com",
      apiKey: process.env.OPENAI_KEY,
    });

    const response = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "user",
          content: `DO NOT use markdown code blocks,backticks, or any text before or after the JSON.
Categorize products into categories. Return pure JSON only in the format: {[categoryKey]: id[]}
        Categories:${CATEGORIES.map((c) => c.key).join(",")}
        Products:${JSON.stringify(listOfUncategorizedProducts)}`,
        },
      ],
    });

    if (!response.choices?.[0]?.message?.content) {
      throw new Error("No response content from OpenAI");
    }

    let parsedData;
    try {
      parsedData = JSON.parse(
        response.choices[0].message.content,
      ) as ProductsCategoriesMapperType;
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", parseError);
      const errorParseApiResponse: ApiResponse = {
        success: false,
        message: "Failed to parse OpenAI response",
      };
      return NextResponse.json(errorParseApiResponse);
    }

    const productsCategorized: (ProductsTableType | undefined)[] = await postprocessReceipts(parsedData);
    const filteredProducts = productsCategorized.filter(
      (product): product is ProductsTableType => product !== undefined,
    );

    const successResponse: ApiResponse = {
      success: true,
      message: "Successfully categorized the products.",
      data: filteredProducts,
      tokens: response.usage?.total_tokens,
    };
    return NextResponse.json(successResponse);
  } catch (error) {
    console.error("API route error: ", error);
    const errorApiRoute: ApiResponse = {
      success: false,
      message: "API route error",
    }
    return NextResponse.json(errorApiRoute);
  }
}
