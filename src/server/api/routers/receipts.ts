import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { ReceiptsInsertSchema, ProductsInsertSchema } from "~/types/receipt";
import { receipts } from "~/server/db/schema/receipts";
import { products } from "~/server/db/schema/products";
import { eq, and, or, ilike, inArray, count, sql } from "drizzle-orm";
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
        .values(input.products.map((product) => ({ ...product, receiptId })))
        .returning();
      if (!product.length) {
        throw new Error(
          "Server-side error: Failed to insert the products in the database.",
        );
      }
      return;
    }),

  get: protectedProcedure
    .input(
      z.object({
        page: z.number(),
        totalItems: z.number(),
        search: z.string().nullable(),
        filters: z
          .object({
            dateStart: z.string().nullable(),
            dateEnd: z.string().nullable(),
            amountStart: z.number().nullable(),
            amountEnd: z.number().nullable(),
          })
          .nullable(),
        sortBy: z.enum(["date-desc", "date-asc", "amount-asc", "amount-desc"]).nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const offset = (input.page - 1) * input.totalItems;
      const limit = input.totalItems;

      const searchClause = input.search
        ? or(
            ilike(receipts.location, `%${input.search}%`),
            ilike(sql`CAST(${receipts.total} AS TEXT)`, `%${input.search}%`),
            ilike(receipts.receiptNumber, `%${input.search}%`),
            ilike(receipts.registrationNumber, `%${input.search}%`),
            ilike(receipts.companyName, `%${input.search}%`),
          )
        : undefined;

      const dateClause = input.filters
        ? and(
            input.filters.dateStart
              ? sql`${receipts.dateTime} >= ${new Date(input.filters.dateStart).toISOString()}`
              : undefined,
            input.filters.dateEnd
              ? sql`${receipts.dateTime} <= ${new Date(input.filters.dateEnd).toISOString()}`
              : undefined,
          )
        : undefined;

      const amountClause = input.filters
      ? and(
        input.filters.amountStart
        ? sql`${receipts.total} >= ${input.filters.amountStart}` :undefined,
        input.filters.amountEnd ? sql`${receipts.total} <= ${input.filters.amountEnd}` : undefined
      ) : undefined;

      let orderByClause;
      switch (input.sortBy) {
        case "date-desc":
          orderByClause = sql`${receipts.dateTime} DESC`;
          break;
        case "date-asc":
          orderByClause = sql`${receipts.dateTime} ASC`;
          break;
        case "amount-asc":
          orderByClause = sql`${receipts.total} ASC`;
          break;
        case "amount-desc":
          orderByClause = sql`${receipts.total} DESC`;
          break;
        default:
          orderByClause = sql`${receipts.dateTime} DESC`; // default sorting
      }

      const whereClause = and(
        eq(receipts.userId, ctx.session.user.id),
        searchClause,
        dateClause,
        amountClause
      );

      const receiptsData = await ctx.db
        .select()
        .from(receipts)
        .offset(offset)
        .limit(limit)
        .where(whereClause)
        .orderBy(orderByClause);
      const receiptsIds: string[] = [];
      receiptsData.forEach((receipt) => {
        receiptsIds.push(receipt.id);
      });
      const productsData = await ctx.db
        .select()
        .from(products)
        .where(inArray(products.receiptId, receiptsIds));
      const productsByReceiptId: Record<string, ProductsTableType[]> = {};
      for (const product of productsData) {
        productsByReceiptId[product.receiptId] ??= [];
        productsByReceiptId[product.receiptId]!.push(product);
      }

      const items = receiptsData.map((receipt) => ({
        ...receipt,
        products: productsByReceiptId[receipt.id] ?? [],
      }));

      const [totalCount] = await ctx.db
        .select({ count: count() })
        .from(receipts)
        .where(whereClause);

      return {
        items,
        totalCount: totalCount?.count,
      };
    }),
});
