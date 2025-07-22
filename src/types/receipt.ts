import { z } from "zod";

// --------------- interfaces used for receipt object formatting during - WEB SCRAPPING - process --------------------
export interface ProductType {
  name: string;
  quantity: number;
  price: number;
  totalPrice: number;
}
export interface ReceiptCompanyType {
  name: string;
  fiscalCode: string;
  address: string;
  registrationNumber: string;
}
export interface ReceiptType {
  company: ReceiptCompanyType;
  products: ProductType[];
  totalAmount: number;
  receiptNumber: string;
  dateTime: string;
}

// ------------------- interfaces and schemas for receipts / products table according to db ------------------------
export const ReceiptsInsertSchema = z.object({
  url: z.string(),
  dateTime: z.date(),
  location: z.string(),
  total: z.string(),
  receiptNumber: z.string(),
  registrationNumber: z.string(),
  companyName: z.string(),
  companyFiscalCode: z.string(),
});

export type ReceipstInsert = z.infer<typeof ReceiptsInsertSchema>;

export const ProductsInsertSchema = z.object({
  name: z.string(),
  quantity: z.string(),
  unitPrice: z.string(),
  totalPrice: z.string(),
});

export type ProductsInsert = z.infer<typeof ProductsInsertSchema>;
