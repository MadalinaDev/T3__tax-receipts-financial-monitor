"use client";

import { FaRegBuilding } from "react-icons/fa";
import { type ReceiptWithProducts } from "~/types/receipt";
import { Separator } from "~/components/ui/separator";
import { Calendar, FileText, MapPin, Box, Map } from "lucide-react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { CATEGORIES } from "~/lib/constants";
import StoreMap from "./storeMap";

const ReceiptDetails = ({ receipt }: { receipt?: ReceiptWithProducts }) => {
  
  if (!receipt)
    return (
      <div className="text-md text-muted-foreground flex h-full w-full items-center justify-center">
        No receipt found.
      </div>
    );

  return (
    <div className="text-navy-blue my-6 flex flex-col gap-y-4">
      <div className="my-4 flex flex-row items-start gap-4">
        <FaRegBuilding className="bg-muted-navy-blue size-12 rounded-sm p-1 text-white" />{" "}
        <div className="flex flex-col gap-y-1 text-xs">
          <p className="text-navy-blue text-lg font-semibold">
            {receipt.companyName}
          </p>
          <div className="text-muted-navy-blue flex flex-row items-baseline gap-x-1">
            Fiscal Code:{" "}
            <p className="font-mono">{receipt.companyFiscalCode} </p>
          </div>
          <div className="text-muted-navy-blue flex flex-row items-baseline gap-x-1">
            Registration:{" "}
            <p className="font-mono">{receipt.registrationNumber} </p>
          </div>
        </div>
      </div>

      <Separator />

      <div className="mt-4 mb-3 grid gap-4 sm:grid-cols-3">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-md">
            <FileText className="text-muted-navy-blue size-6" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium">Receipt Number</p>
            <p className="mt-1 font-mono text-sm">{receipt.receiptNumber}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-md">
            <Calendar className="text-muted-navy-blue size-6" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium">Date & Time</p>
            <p className="mt-1 text-sm">
              {format(receipt.dateTime, "MMM dd, yyyy, HH:mm")}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-md">
            <MapPin className="text-muted-navy-blue size-6" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium">Location</p>
            <p className="mt-1 text-sm">{receipt.location}</p>
          </div>
        </div>
      </div>

      <Separator />

      <div className="mt-4 -mb-2 flex flex-row items-baseline justify-between">
        <div className="flex items-center gap-4 font-medium">
          <div className="flex h-10 w-10 items-center justify-center rounded-md">
            <Box className="text-muted-navy-blue size-6" />
          </div>
          <div className="">Items Purchased</div>
        </div>
        <div className="text-muted-navy-blue text-sm">
          {receipt.products.length} items
        </div>
      </div>

      <Table className="text-muted-navy-blue">
        <TableHeader>
          <TableRow className="bg-[#f9f9f9]">
            {/* to do: reduce header names for mobile, add ellipsis for long product names */}
            <TableHead className="text-navy-blue w-140 text-sm">
              PRODUCT
            </TableHead>
            <TableHead className="text-navy-blue text-sm">CATEGORY</TableHead>
            <TableHead className="text-navy-blue text-sm">QUANTITY</TableHead>
            <TableHead className="text-navy-blue text-sm">UNIT PRICE</TableHead>
            <TableHead className="text-navy-blue w-20 text-right text-sm">
              TOTAL
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {receipt.products.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.name}</TableCell>
              <TableCell>
                {CATEGORIES.find((c) => c.key === p.category)?.name ??
                  "Unknown"}
              </TableCell>
              <TableCell>{p.quantity}</TableCell>
              <TableCell>MDL {p.unitPrice}</TableCell>
              <TableCell className="text-right">MDL {p.totalPrice}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>TOTAL</TableCell>
            <TableCell className="text-right">MDL {receipt.total}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <div className="mt-4 flex items-center gap-4 font-medium">
        <div className="flex h-10 w-10 items-center justify-center rounded-md">
          <Map className="text-muted-navy-blue size-6" />
        </div>
        <div className="">Store location</div>
      </div>

      <StoreMap address={receipt.location}/>
    </div>
  );
};

export default ReceiptDetails;
