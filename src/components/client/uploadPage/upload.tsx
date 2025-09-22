"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UploadForm from "./uploadForm";

const testURLS = [
  "https://mev.sfs.md/receipt-verifier/J105002238/156.77/46151/2024-11-12",
  "https://mev.sfs.md/receipt-verifier/DC2112715A4A58B5B721BAA0D937588F",
  "https://mev.sfs.md/receipt-verifier/8FC7FA2D3782CAC61EDC9FE582619957",
];

export default function Upload() {
  const [link, setLink] = useState("");
  const router = useRouter();

  const processScrapeByLink = () => {
    if (link) {
      router.push(`/upload?scrapeLink=${encodeURIComponent(link)}`);
    }
  };

  return (
    <UploadForm
      link={link}
      setLink={setLink}
      processScrapeByLink={processScrapeByLink}
      testURLS={testURLS}
    />
  );
}
