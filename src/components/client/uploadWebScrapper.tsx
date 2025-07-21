"use client";
import { useState, useEffect } from "react";
import { Loader2, Check, Ban, HardDriveUpload } from "lucide-react";
import Receipt from "./receiptSkeleton";
import { Button } from "../ui/button";
import type { ReceiptType } from "~/types/receipt";

const UploadWebScrapper = ({ scrapeLink }: { scrapeLink: string }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [receiptData, setReceiptData] = useState<ReceiptType | null>(null);

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

  return (
    <div>
      {loading ? (
        <div className="my-[15%] w-full">
          <Loader2 className="mx-auto animate-spin" />
        </div>
      ) : receiptData ? (
        <div>
          <div className="mx-auto my-[5%] flex flex-row items-start justify-center gap-4 md:gap-6">
            <Check className="size-8 md:size-6" />
            <div>
              {" "}
              Your receipt information was web scrapped successfully. For more
              details check the console.
            </div>
          </div>
          <Receipt receiptData={receiptData} />
          <Button variant="outline" className="mx-auto my-6 block">
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
