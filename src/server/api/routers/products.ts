import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { products } from "~/server/db/schema/products";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";

export const productsRouter = createTRPCRouter({
  update: protectedProcedure
    .input(z.array(z.object({ id: z.string(), category: z.string() })))
    .mutation(async ({ input }) => {
      return updateProducts(input);
    }),
});

export const updateProducts = async (input: { id: string; category: string }[]) => {
  return await db.transaction(async (tx) => {
    const results = [];
    for (const item of input) {
      const updatedProduct = await tx
        .update(products)
        .set({ category: item.category })
        .where(eq(products.id, item.id))
        .returning();

      if (!updatedProduct.length) {
        throw new Error(`Product not found: ${item.id}`);
      }
      results.push(updatedProduct[0]);
    }
    return results;
  });
};
