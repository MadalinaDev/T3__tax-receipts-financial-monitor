"use client";
import { useState, useEffect } from "react";
import {
  Loader2,
  Check,
  Ban,
  PartyPopper,
  MoveRight,
} from "lucide-react";
import Receipt from "./receiptSkeleton";
import { Button } from "../ui/button";
import type { ReceiptType } from "~/types/receipt";
import Link from "next/link";
import Upload from "./upload";
import SaveReceiptButton from "./uploadPage/saveReceiptButton";
import RetryScrapeButton from "./uploadPage/retryScrapeButton";

const UploadWebScrapper = ({ scrapeLink }: { scrapeLink: string }) => {
  const [loading, setLoading] = useState<boolean | null>(null);
  const [receiptData, setReceiptData] = useState<ReceiptType | null>(null);
  const [startedConfirm, setStartedConfirm] = useState<boolean>(false);
  const [confirmationMessage, setConfirmationMessage] = useState<{
    success: boolean;
    message: string;
  }>();

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
          <SaveReceiptButton
            receiptData={receiptData}
            setLoading={setLoading}
            setStartedConfirm={setStartedConfirm}
            setConfirmationMessage={setConfirmationMessage}
            scrapeLink={scrapeLink}
          />
        </div>
      ) : (
        <div className="text-navy-blue mx-auto my-[35%] text-center">
          <Ban className="mx-auto mb-4 size-8 md:size-6" />
          <div className="mb-6">
            Oops! We couldn not scrape the data. Please try again later.
          </div>
          <RetryScrapeButton fetchScrape={fetchScrape}/>
        </div>
      )}
    </div>
  );
};

export default UploadWebScrapper;
