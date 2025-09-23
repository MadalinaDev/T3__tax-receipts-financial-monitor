"use client";

import { useState, useEffect } from "react";
import { Loader2, Check, Ban, PartyPopper, MoveRight } from "lucide-react";
import Receipt from "./receiptSkeleton";
import { Button } from "~/components/ui/button";
import type { ReceiptType } from "~/types/receipt";
import Link from "next/link";
import Upload from "./upload";
import SaveReceiptButton from "./saveReceiptButton";
import RetryScrapeButton from "./retryScrapeButton";

interface UploadWebScrapperProps {
  scrapeLink: string;
}

type ConfirmationState =
  | {
      success: boolean;
      message: string;
    }
  | undefined;

export default function UploadWebScrapper({
  scrapeLink,
}: UploadWebScrapperProps) {
  const [loading, setLoading] = useState<boolean | null>(null);
  const [receiptData, setReceiptData] = useState<ReceiptType | null>(null);
  const [startedConfirm, setStartedConfirm] = useState(false);
  const [confirmationMessage, setConfirmationMessage] =
    useState<ConfirmationState>();

  const fetchScrape = async () => {
    setLoading(true);
    setReceiptData(null);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await fetch(
        `${baseUrl}api/scrape?link=${encodeURIComponent(scrapeLink)}&ultra_premium=true`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const result = (await response.json()) as ReceiptType;
      setReceiptData(result);
    } catch (error) {
      console.error("Web scraping error:", error);
      setReceiptData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchScrape();
  }, [scrapeLink]);

  if (!scrapeLink) return <Upload />;

  if (confirmationMessage) {
    return <ConfirmationView {...confirmationMessage} />;
  }

  if (loading !== false || startedConfirm) {
    return <LoadingView />;
  }

  if (receiptData) {
    return (
      <SuccessView
        receiptData={receiptData}
        scrapeLink={scrapeLink}
        setLoading={setLoading}
        setStartedConfirm={setStartedConfirm}
        setConfirmationMessage={setConfirmationMessage}
      />
    );
  }

  return <ErrorView fetchScrape={fetchScrape} />;
}

function ConfirmationView({
  success,
  message,
}: {
  success: boolean;
  message: string;
}) {
  const Icon = success ? PartyPopper : Ban;

  return (
    <div className="my-48 text-center">
      <div className="text-navy-blue flex flex-row items-center justify-center gap-4">
        <Icon className="size-8 md:size-6" />
        {message}
      </div>
      <div className="mt-4 flex justify-center">
        <Link href={success ? "/receipts" : "/"}>
          <Button variant="outline" className="mx-auto px-6">
            {success ? "Check out your receipts" : "Go to main page"}
            <MoveRight className="ml-2 size-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

function LoadingView() {
  return (
    <div className="flex min-h-[40vh] w-full items-center justify-center">
      <Loader2 className="animate-spin" />
    </div>
  );
}

function SuccessView({
  receiptData,
  scrapeLink,
  setLoading,
  setStartedConfirm,
  setConfirmationMessage,
}: {
  receiptData: ReceiptType;
  scrapeLink: string;
  setLoading: (loading: boolean) => void;
  setStartedConfirm: (started: boolean) => void;
  setConfirmationMessage: (message: ConfirmationState) => void;
}) {
  return (
    <div className="text-navy-blue">
      <div className="mx-auto mt-12 mb-6 flex flex-row items-start justify-center gap-4 md:gap-6">
        <Check className="size-8 md:size-6" />
        <div>
          Your receipt information was scraped successfully. Review the details
          below:
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
  );
}

function ErrorView({ fetchScrape }: { fetchScrape: () => void }) {
  return (
    <div className="text-navy-blue mx-auto my-[35%] text-center">
      <Ban className="mx-auto mb-4 size-8 md:size-6" />
      <div className="mb-6">
        Oops! We couldn&lsquo;t scrape the data. Please try again later.
      </div>
      <RetryScrapeButton fetchScrape={fetchScrape} />
    </div>
  );
}
