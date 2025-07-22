import { sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  numeric,
} from "drizzle-orm/pg-core";
import { receipts } from "./receipts";

export const products = pgTable("products", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .notNull()
    .primaryKey(),
  name: text("name").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
  receiptId: uuid("receipt_id").references(() => receipts.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});
