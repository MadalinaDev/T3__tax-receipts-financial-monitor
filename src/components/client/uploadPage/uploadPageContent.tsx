"use client";

import Upload from "./upload";
import UploadWebScrapper from "./uploadWebScrapper";

interface UploadPageContentProps {
  scrapeLink?: string;
}

export default function UploadPageContent({
  scrapeLink,
}: UploadPageContentProps) {
  if (scrapeLink) {
    return <UploadWebScrapper scrapeLink={scrapeLink} />;
  }

  return <Upload />;
}
