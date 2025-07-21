import { Card, CardHeader, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import type { ReceiptType } from "~/types/receipt";

const Receipt = ({ receiptData } : {receiptData: ReceiptType}) => {

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ro-RO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} MDL`;
  };

  const formatQuantity = (quantity: number) => {
    return quantity % 1 === 0 ? quantity.toString() : quantity.toFixed(3);
  };

  return (
    <div className="mx-auto max-w-md p-4">
      <Card className="bg-white shadow-lg">
        <CardHeader className="pb-4 text-center">
          <div className="space-y-1">
            <h1 className="text-lg font-bold text-gray-900">
              {receiptData.company.name}
            </h1>
            <p className="text-sm text-gray-600">
              {receiptData.company.address}
            </p>
            <div className="space-y-1 text-xs text-gray-500">
              <p>Cod fiscal: {receiptData.company.fiscalCode}</p>
              <p>Nr. înregistrare: {receiptData.company.registrationNumber}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-1 text-center">
            <p className="text-sm font-medium">BON FISCAL</p>
            <p className="text-xs text-gray-600">
              Nr: {receiptData.receiptNumber}
            </p>
            <p className="text-xs text-gray-600">
              {formatDate(receiptData.dateTime)}
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-1 border-b pb-1 text-xs font-medium text-gray-700">
              <div className="col-span-6">Produs</div>
              <div className="col-span-2 text-center">Cant.</div>
              <div className="col-span-2 text-right">Preț</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {receiptData.products.map((product, index) => (
              <div key={index} className="grid grid-cols-12 gap-1 text-xs">
                <div className="col-span-6 leading-tight text-gray-900">
                  {product.name}
                </div>
                <div className="col-span-2 text-center text-gray-700">
                  {formatQuantity(product.quantity)}
                </div>
                <div className="col-span-2 text-right text-gray-700">
                  {formatPrice(product.price)}
                </div>
                <div className="col-span-2 text-right font-medium text-gray-900">
                  {formatPrice(product.totalPrice)}
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <div className="flex items-center justify-between pt-2">
            <span className="text-lg font-bold text-gray-900">TOTAL:</span>
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(receiptData.totalAmount)}
            </span>
          </div>

          <div className="border-t pt-4 text-center">
            <p className="text-xs text-gray-500">
              Mulțumim pentru cumpărături!
            </p>
            <p className="mt-1 text-xs text-gray-500">Păstrați bonul fiscal</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Receipt;