import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { ReceiptsInsertSchema, ProductsInsertSchema } from "~/types/receipt";
import { receipts } from "~/server/db/schema/receipts";
import { products } from "~/server/db/schema/products";

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
});
