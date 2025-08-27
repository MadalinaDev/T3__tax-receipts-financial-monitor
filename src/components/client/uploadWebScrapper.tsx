"use client";
import { useState, useEffect } from "react";
import {
  Loader2,
  Check,
  Ban,
  HardDriveUpload,
  PartyPopper,
  MoveRight,
  RefreshCw,
} from "lucide-react";
import Receipt from "./receiptSkeleton";
import { Button } from "../ui/button";
import type { ReceiptType } from "~/types/receipt";
import { api } from "~/trpc/react";
import { type ProductsInsert } from "~/types/receipt";
import Link from "next/link";
import { useUser } from "@clerk/clerk-react";
import Upload from "./upload";

const UploadWebScrapper = ({ scrapeLink }: { scrapeLink: string }) => {
  const [loading, setLoading] = useState<boolean | null>(null);
  const [receiptData, setReceiptData] = useState<ReceiptType | null>(null);
  const [startedConfirm, setStartedConfirm] = useState<boolean>(false);
  const [confirmationMessage, setConfirmationMessage] = useState<{
    success: boolean;
    message: string;
  }>();
  const { isLoaded, isSignedIn, user } = useUser();

  const fetchScrape = async () => {
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await fetch(
        `${baseUrl}api/scrape?link=${scrapeLink}&ultra_premium=true`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (!response.ok)
        throw new Error(`Server responded with ${response.status}`);

      const result = (await response.json()) as ReceiptType;
      setReceiptData(result);
    } catch (e) {
      console.error("Web scraping error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchScrape();
  }, [scrapeLink]);

  if (!isLoaded) return null;
  if (!isSignedIn) return null;

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

  if (!scrapeLink) return <Upload />;

  return (
    <div>
      {confirmationMessage ? (
        <div className="text-navy-blue my-48">
          <div className="text-navy-blue flex flex-row items-center justify-center gap-4">
            {confirmationMessage.success ? (
              <PartyPopper className="size-8 md:size-6" />
            ) : (
              <Ban className="size-8 md:size-6" />
            )}
            {confirmationMessage.message}
          </div>
          <div className="text-navy-blue mt-4 flex justify-center">
            <Link href={confirmationMessage.success ? "/receipts" : "/"}>
              <Button variant="outline" className="mx-auto px-6">
                {confirmationMessage.success
                  ? "Check out your receipts"
                  : "Go to main page"}
                <MoveRight className="size-8 md:size-6" />
              </Button>
            </Link>
          </div>
        </div>
      ) : loading !== false || startedConfirm ? (
        <div className="flex min-h-[40vh] w-full items-center justify-center">
          <Loader2 className="mx-auto animate-spin" />
        </div>
      ) : receiptData ? (
        <div className="text-navy-blue">
          <div className="mx-auto mt-12 mb-6 flex flex-row items-start justify-center gap-4 md:gap-6">
            <Check className="size-8 md:size-6" />
            <div>
              {" "}
              Your receipt information was scrapped successfully. Review the
              details below:
            </div>
          </div>
          <Receipt receiptData={receiptData} />
          <Button
            variant="outline"
            className="mx-auto my-6 block md:mb-12"
            onClick={handleSaveReceiptData}
          >
            <div className="flex flex-row gap-2 px-6">
              Upload this receipt to my database <HardDriveUpload />
            </div>{" "}
          </Button>
        </div>
      ) : (
        <div className="text-navy-blue mx-auto my-[35%] text-center">
          <Ban className="mx-auto mb-4 size-8 md:size-6" />
          <div className="mb-6">
            Oops! We couldn not scrape the data. Please try again later.
          </div>
          <Button
            variant="outline"
            onClick={fetchScrape}
            className="mx-auto flex items-center gap-2"
          >
            Retry <RefreshCw className="size-6" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default UploadWebScrapper;
