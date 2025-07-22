import { sql } from "drizzle-orm";
import { pgTable, uuid, text, timestamp, numeric } from "drizzle-orm/pg-core";

export const receipts = pgTable("receipts", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .notNull()
    .primaryKey(),
  url: text("url").notNull(),
  dateTime: timestamp("date_time", { withTimezone: true }).notNull(),
  location: text("location").notNull(),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  receiptNumber: text("receipt_number").notNull(),
  registrationNumber: text("registration_number").notNull(),
  companyName: text("company_name").notNull(),
  companyFiscalCode: text("company_fiscal_code").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});
