import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { ReceiptsInsertSchema, ProductsInsertSchema } from "~/types/receipt";
import { receipts } from "~/server/db/schema/receipts";
import { products } from "~/server/db/schema/products";
import { eq, inArray } from "drizzle-orm";
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
      offset: z.number(),
      limit: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      const receiptsData = await ctx.db
        .select()
        .from(receipts)
        .offset(input.offset)
        .limit(input.limit)
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

      const result = receiptsData.map((receipt) => ({
        ...receipt,
        products: productsByReceiptId[receipt.id] ?? [],
      }))

      return result;
    })
});
