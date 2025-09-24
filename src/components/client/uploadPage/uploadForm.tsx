"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "~/components/ui/tabs";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { FileQuestionIcon as AiOutlineQuestionCircle } from "lucide-react";
import QrScanner from "./qrScanner";

interface UploadFormProps {
  link: string;
  setLink: (link: string) => void;
  processScrapeByLink: () => void;
  testURLS: string[];
}

export default function UploadForm({
  link,
  setLink,
  processScrapeByLink,
  testURLS,
}: UploadFormProps) {
  return (
    <div className="mx-auto my-2 max-w-sm md:my-12 md:min-w-xl">
      <div className="my-10 text-center">
        <p className="text-lg font-semibold">Upload your receipt</p>
        <p className="text-md">
          Choose an option to upload your tax receipt information
        </p>
      </div>

      <Tabs defaultValue="link">
        <TabsList className="w-full">
          <TabsTrigger value="link">Via Link</TabsTrigger>
          <TabsTrigger value="qr">QR Photo</TabsTrigger>
          <TabsTrigger value="manual">Manual</TabsTrigger>
        </TabsList>

        <TabsContent value="link" className="mx-2 my-4">
          <Label htmlFor="link" className="m-2">
            Link
          </Label>
          <Input
            id="link"
            placeholder="https://"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && processScrapeByLink()}
          />
          <Button
            onClick={processScrapeByLink}
            disabled={!link}
            className="bg-navy-blue/80 hover:bg-navy-blue/60 my-2 w-full"
          >
            Process
          </Button>
          <TestReceiptsAlert testURLS={testURLS} setLink={setLink} />
        </TabsContent>

        <TabsContent value="qr">
          <QrScannerForm
            link={link}
            setLink={setLink}
            processScrapeByLink={processScrapeByLink}
            testURLS={testURLS}
          />
        </TabsContent>

        <TabsContent value="manual">
          <ManualForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ManualForm() {
  return (
    <>
      <div className="mt-6 grid grid-cols-2 grid-rows-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ecc-number">
            ECC Registration Number
            <span className="ml-1 text-red-500">*</span>
          </Label>
          <Input
            id="ecc-number"
            placeholder="ex: 21AAF5E18569281FEEC2AC4313FDEB07"
            className="font-mono text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="receipt-number">
            Receipt number
            <span className="ml-1 text-red-500">*</span>
          </Label>
          <Input id="receipt-number" placeholder="ex: 12345" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="total-amount">
            Total sum of receipt
            <span className="ml-1 text-red-500">*</span>
          </Label>
          <Input
            id="total-amount"
            type="number"
            step="0.01"
            placeholder="ex: 125.50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="issue-date">
            Date of emission
            <span className="ml-1 text-red-500">*</span>
          </Label>
          <Input id="issue-date" type="date" />
        </div>
      </div>
      <Button
        className="bg-navy-blue/80 hover:bg-navy-blue/60 my-2 w-full"
        disabled
      >
        Process
      </Button>
    </>
  );
}

function TestReceiptsAlert({
  testURLS,
  setLink,
}: {
  testURLS: string[];
  setLink: (link: string) => void;
}) {
  return (
    <Alert className="my-6">
      <AiOutlineQuestionCircle className="text-navy-blue" />
      <AlertTitle className="text-navy-blue">
        Don&lsquo;t have any receipts to upload yet?
      </AlertTitle>
      <AlertDescription className="text-navy-blue/70">
        <span>Test the platform functionality with these sample options:</span>
        <div className="text-navy-blue flex w-full flex-col items-center justify-center gap-4 md:flex-row">
          {testURLS.map((url, index) => (
            <Button key={url} variant="outline" onClick={() => setLink(url)}>
              Receipt #{index + 1}
            </Button>
          ))}
        </div>
      </AlertDescription>
    </Alert>
  );
}

const QrScannerForm = ({
  link,
  setLink,
  processScrapeByLink,
}: UploadFormProps) => {

  const handleScannedLink = (link: string) => {
    setLink(link);
  };

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-4">
        <QrScanner onScan={handleScannedLink} />

        {link && (
          <div className="w-full">
            <div className="mt-6">Your scanned link is: {link}</div>
            <Button
              onClick={processScrapeByLink}
              disabled={!link}
              className="bg-navy-blue/80 hover:bg-navy-blue/60 my-2 w-full"
            >
              Process
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
