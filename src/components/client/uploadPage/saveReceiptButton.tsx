"use client";
import { type ProductsInsert } from "~/types/receipt";
import { HardDriveUpload } from "lucide-react";
import { Button } from "~/components/ui/button";
import { type ReceiptType } from "~/types/receipt";
import { useUser } from "@clerk/nextjs";
import { api } from "~/trpc/react";

const SaveReceiptButton = ({
  receiptData,
  setLoading,
  setStartedConfirm,
  setConfirmationMessage,
  scrapeLink,
}: {
  receiptData: ReceiptType;
  setLoading: (arg: boolean) => void;
  setStartedConfirm: (arg: boolean) => void;
  setConfirmationMessage: (arg: { success: boolean; message: string }) => void;
  scrapeLink: string;
}) => {
  const { user } = useUser();

  const saveReceiptData = api.receipts.create.useMutation({
    onSuccess: () => {
      setConfirmationMessage({
        success: true,
        message: "Your receipt was successfully uploaded into the system!",
      });
    },
    onError: (e) => {
      setConfirmationMessage({
        success: false,
        message:
          "An unexpected error occured while uploading your receipt. Please try again later.",
      });
      console.error("Error: ", e);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const handleSaveReceiptData = () => {
    setLoading(true);
    setStartedConfirm(true);
    if (!receiptData) {
      console.error(
        "Client-side error: there is no valid data to be uploaded.",
      );
      return;
    }
    if (!user) {
      console.error("Client-side error: no user signed in.");
      return;
    }

    const formattedReceipt = {
      userId: user.id,
      url: scrapeLink,
      dateTime: new Date(receiptData.dateTime),
      location: receiptData.company.address,
      total: String(receiptData.totalAmount),
      receiptNumber: receiptData.receiptNumber,
      registrationNumber: receiptData.company.registrationNumber,
      companyName: receiptData.company.name,
      companyFiscalCode: receiptData.company.fiscalCode,
    };

    const formattedProducts: ProductsInsert[] = [];
    receiptData.products.forEach((item) => {
      formattedProducts.push({
        name: item.name,
        quantity: String(item.quantity),
        unitPrice: String(item.price),
        totalPrice: String(item.totalPrice),
      });
    });

    saveReceiptData.mutate({
      receipt: formattedReceipt,
      products: formattedProducts,
    });
  };

  return (
    <Button
      variant="outline"
      className="mx-auto my-6 block md:mb-12"
      onClick={handleSaveReceiptData}
    >
      <div className="flex flex-row gap-2 px-6">
        Upload this receipt to my database <HardDriveUpload />
      </div>{" "}
    </Button>
  );
};

export default SaveReceiptButton;
