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
