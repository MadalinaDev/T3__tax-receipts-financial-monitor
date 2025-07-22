ALTER TABLE "products" DROP CONSTRAINT "products_receipt_id_receipts_id_fk";
--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "receipt_id";