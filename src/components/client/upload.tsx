"use client";
import { useState } from "react";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Scan } from "lucide-react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { AiOutlineQuestionCircle } from "react-icons/ai";

const testURLS = [
  "https://mev.sfs.md/receipt-verifier/J105002238/156.77/46151/2024-11-12",
  "https://mev.sfs.md/receipt-verifier/DC2112715A4A58B5B721BAA0D937588F",
  "https://mev.sfs.md/receipt-verifier/8FC7FA2D3782CAC61EDC9FE582619957",
];

const Upload = () => {
  const [link, setLink] = useState("");

  const router = useRouter();

  const processScrapeByLink = () => {
    router.push(`/upload?scrapeLink=${link}`);
  };

  return (
    <div className="mx-auto my-2 md:my-12 md:min-w-2xl">
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
          />
          <Button
            onClick={() => {
              if (link) processScrapeByLink();
            }}
            className="bg-navy-blue/80 hover:bg-navy-blue/60 my-2 w-full"
          >
            Process
          </Button>
        </TabsContent>

        <TabsContent value="qr">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-4">
              <Scan className="text-muted-foreground m-3 size-8 md:size-12" />
              <div className="text-muted-foreground">
                Upload a photo with your QR
              </div>
            </CardContent>
          </Card>
          <Button
            variant="default"
            className="bg-navy-blue/80 hover:bg-navy-blue/60 my-2 w-full"
          >
            Process
          </Button>
        </TabsContent>

        <TabsContent value="manual">
          <div className="mt-6 grid grid-cols-2 grid-rows-2 space-y-4 space-x-4">
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
          <Button className="bg-navy-blue/80 hover:bg-navy-blue/60 my-2 w-full">
            Process
          </Button>
        </TabsContent>
      </Tabs>

      <Alert className="mt-6">
        <AiOutlineQuestionCircle className="text-navy-blue" />
        <AlertTitle className="text-navy-blue">
          Don&lsquo;t have any receipts to upload yet?
        </AlertTitle>
        <AlertDescription className="text-navy-blue/70">
          <span>
            Test the platform functionality with these sample options:
          </span>
          <div className="text-navy-blue flex w-full items-center justify-center gap-x-4">
            <Button
              variant="outline"
              onClick={() => setLink(testURLS[0] ?? "")}
            >
              Receipt #1
            </Button>
            <Button
              variant="outline"
              onClick={() => setLink(testURLS[1] ?? "")}
            >
              Receipt #2
            </Button>
            <Button
              variant="outline"
              onClick={() => setLink(testURLS[2] ?? "")}
            >
              Receipt #3
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default Upload;
