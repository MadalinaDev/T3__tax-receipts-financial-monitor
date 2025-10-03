"use server";

import SpendingsOverTimeChart from "~/components/client/statisticsPage/spendingsOverTimeChart";
import ProductsByCategoryChart from "~/components/client/statisticsPage/productsByCategoryChart";
import { api } from "~/trpc/server";
import { type ReceiptsTableType } from "~/server/db/schema/receipts";
import { type ProductsTableType } from "~/server/db/schema/products";
import { type ChartTypeSpendingsOverTime } from "~/types/statisticsCharts";
import { CATEGORIES } from "~/lib/constants";
import { categorizeProductsWithOpenAI } from "~/lib/productsCategorization";
import type { ReceiptWithProducts } from "~/types/receipt";

const updateProductsCategorizationsViaOpenAI = async (
  receipts: ReceiptWithProducts[],
) => {
  const response = await categorizeProductsWithOpenAI(receipts);
  console.log("Response from OpenAI product categorization: ", response);
};

const generateSpendingsOverTime = (
  receipts: ReceiptsTableType[],
): ChartTypeSpendingsOverTime => {
  return receipts.map((r) => ({
    id: r.id,
    name: r.dateTime.toLocaleDateString("en-GB"),
    dx: Math.floor(r.dateTime.getTime() / 1000),
    dy: Number(r.total),
  }));
};

const generateProductsByCategory = (products: ProductsTableType[]) => {
  // process products statistics (make necessary aggregations)
  const categoriesMap: Record<string, number> = Object.fromEntries(
    CATEGORIES.map((c) => [c.key, 0]),
  );
  const shortenedCategories = CATEGORIES.map((c) => c.key);
  type CategoriesType = (typeof shortenedCategories)[number];
  products.filter(Boolean).forEach((p: ProductsTableType) => {
    const category = p.category;
    if (category && categoriesMap[category] !== undefined) {
      categoriesMap[category] += Number(p.quantity);
    }
  });
  // return the array in chart data format
  const data: { id: string; name: CategoriesType; dy: number }[] = [];
  for (const [key, value] of Object.entries(categoriesMap)) {
    if (value > 0) {
      data.push({
        id: key,
        name: key,
        dy: Math.round(value),
      });
    }
  }
  return data;
};

const StatisticsContent = async () => {
  const receipts = await api.receipts.getAll();

  await updateProductsCategorizationsViaOpenAI(receipts);

  const chartDataSpendingsOverTime = generateSpendingsOverTime(receipts);
  const products = await api.products.getAll();
  const chartDataProductsByCategory = generateProductsByCategory(products);

  return (
    <div className="my-8 flex flex-col gap-y-2 md:my-12 md:gap-y-4">
      <SpendingsOverTimeChart data={chartDataSpendingsOverTime} />
      <ProductsByCategoryChart data={chartDataProductsByCategory} />
    </div>
  );
};

export default StatisticsContent;
