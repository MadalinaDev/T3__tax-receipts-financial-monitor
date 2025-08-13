"use client";
import { useState, useEffect } from "react";
import {
  Loader2,
  Check,
  Ban,
  HardDriveUpload,
  PartyPopper,
  MoveRight,
} from "lucide-react";
import Receipt from "./receiptSkeleton";
import { Button } from "../ui/button";
import type { ReceiptType } from "~/types/receipt";
import { api } from "~/trpc/react";
import { type ProductsInsert } from "~/types/receipt";
import Link from "next/link";
import { useUser } from "@clerk/clerk-react";

const UploadWebScrapper = ({ scrapeLink }: { scrapeLink: string }) => {
  const [loading, setLoading] = useState<boolean | null>(null);
  const [receiptData, setReceiptData] = useState<ReceiptType | null>(null);
  const [startedConfirm, setStartedConfirm] = useState<boolean>(false);
  const [confirmationMessage, setConfirmationMessage] = useState<{
    success: boolean;
    message: string;
  }>();
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    setLoading(true);
    const scrapeByLink = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const response = await fetch(
          `${baseUrl}api/scrape?link=${scrapeLink}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        const result = (await response.json()) as ReceiptType;
        if (response.status === 200) setReceiptData(result);
        return;
      } catch (e) {
        console.error("Client-side error during web scrapping: ", e);
        return;
      } finally {
        setLoading(false);
      }
    };
    void scrapeByLink();
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

  return (
    <div>
      {confirmationMessage ? (
        <div className="my-48">
          <div className="text-muted-foreground flex flex-row items-center justify-center gap-4">
            {confirmationMessage.success ? (
              <PartyPopper className="size-8 md:size-6" />
            ) : (
              <Ban className="size-8 md:size-6" />
            )}
            {confirmationMessage.message}
          </div>
          <div className="text-muted-foreground mt-4 flex justify-center">
            <Link href={confirmationMessage.success ? "/statistics" : "/"}>
              <Button variant="outline" className="mx-auto px-6">
                {confirmationMessage.success
                  ? "Check out your statistics"
                  : "Go to main page"}
                <MoveRight className="size-8 md:size-6" />
              </Button>
            </Link>
          </div>
        </div>
      ) : loading !== false || startedConfirm ? (
        <div className="my-[15%] w-full">
          <Loader2 className="mx-auto animate-spin" />
        </div>
      ) : receiptData ? (
        <div>
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
            className="mx-auto my-6 block"
            onClick={handleSaveReceiptData}
          >
            <div className="flex flex-row gap-2 px-6">
              Upload this receipt to my database <HardDriveUpload />
            </div>{" "}
          </Button>
        </div>
      ) : (
        <div className="mx-auto my-[15%] flex flex-row items-center justify-center gap-8">
          <Ban className="size-8 md:size-6" />
          <div>
            {" "}
            An unexpected error occured while webscrapping the data. For more
            information please check the console.
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadWebScrapper;
