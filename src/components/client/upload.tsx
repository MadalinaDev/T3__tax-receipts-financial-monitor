"use client";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Scan } from "lucide-react";

const Upload = () => {
  return (
    <div className="mx-2 my-2 md:mx-72 md:my-12">
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
          <Input id="link" placeholder="https://" />
          <Button variant="default" onClick={() => {}} className="my-2 w-full">
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
          <Button variant="default" onClick={() => {}} className="my-2 w-full">
            Process
          </Button>
        </TabsContent>

        <TabsContent value="manual">
          <div className=" mt-6 grid grid-cols-2 grid-rows-2 space-y-4 space-x-4">
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
          <Button variant="default" onClick={() => {}} className="my-2 w-full">
            Process
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Upload;
