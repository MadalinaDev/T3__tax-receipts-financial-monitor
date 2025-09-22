"use server";

import { Suspense } from "react";
import UploadPageContent from "~/components/client/uploadPage/uploadPageContent";

interface UploadPageProps {
  searchParams: Promise<{ scrapeLink: string }>;
}

export default async function UploadPage({ searchParams }: UploadPageProps) {
  const { scrapeLink } = await searchParams;

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
        </div>
      }
    >
      <UploadPageContent scrapeLink={scrapeLink} />
    </Suspense>
  );
}
