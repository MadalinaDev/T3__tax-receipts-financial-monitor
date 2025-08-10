import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { ReceiptsInsertSchema, ProductsInsertSchema } from "~/types/receipt";
import { receipts } from "~/server/db/schema/receipts";
import { products } from "~/server/db/schema/products";
import { eq, inArray, count } from "drizzle-orm";
import type { ProductsTableType } from "~/server/db/schema/products";

const PostReceiptDataSchema = z.object({
  receipt: ReceiptsInsertSchema,
  products: z.array(ProductsInsertSchema),
});

export const receiptsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(PostReceiptDataSchema)
    .mutation(async ({ ctx, input }) => {
      // insert receipt
      const receipt = await ctx.db
        .insert(receipts)
        .values(input.receipt)
        .returning();
      if (!receipt.length) {
        throw new Error(
          "Server-side error: Failed to insert the receipt in the database.",
        );
      }
      const receiptId = receipt[0]!.id;

      // insert products
      const product = await ctx.db
        .insert(products)
        .values(input.products.map((product) => ({ ...product, receiptId }))).returning();
      if (!product.length) {
        throw new Error(
          "Server-side error: Failed to insert the products in the database.",
        );
      }
      return;
    }),

  get: protectedProcedure
    .input(z.object({
      page: z.number(),
      totalItems: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      const offset = (input.page - 1) * input.totalItems;
      const limit = input.totalItems;
      const receiptsData = await ctx.db
        .select()
        .from(receipts)
        .offset(offset)
        .limit(limit)
        .where(eq(receipts.userId, ctx.session.user.id));
      const receiptsIds: string[] = [];
      receiptsData.forEach((receipt) => {
        receiptsIds.push(receipt.id);
      });
      const productsData = await ctx.db.select().from(products).where(inArray(products.receiptId, receiptsIds));
      const productsByReceiptId: Record<string, ProductsTableType[]> = {};
      for (const product of productsData) {
        productsByReceiptId[product.receiptId] ??= [];
        productsByReceiptId[product.receiptId]!.push(product);
      }

      const items = receiptsData.map((receipt) => ({
        ...receipt,
        products: productsByReceiptId[receipt.id] ?? [],
      }))

      const [totalCount] = await ctx.db.select({ count: count()}).from(receipts).where(eq(receipts.userId, ctx.session.user.id));
      const totalPages = Math.ceil((totalCount?.count ?? 0) / limit);

      return {
        items,
        totalCount: totalCount?.count,
        totalPages,
      };
    })
});
