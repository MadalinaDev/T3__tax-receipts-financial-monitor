"use client";
import { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import {
  FileText,
  Search,
  ListFilter,
  MapPinIcon,
  Calendar,
  MoveLeft,
  MoveRight,
} from "lucide-react";
import TimeAgo from "react-timeago";
import { DatePicker } from "../ui/date-picker";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../ui/select";
import { Slider } from "../ui/slider";

const ReceiptsTable = () => {
  return (
    <div className="my-8 grid w-full grid-cols-7 gap-x-8">
      <ReceiptsFilters />
      <div className="col-span-5">
        <div className="relative">
          <Search className="absolute top-3 left-3 size-4" />
          <Input
            placeholder="Search receipts..."
            className="pl-9"
          />
        </div>
        <ReceiptsGrid />
        {/* pagination section */}
        <div className="flex flex-row items-center justify-center gap-x-3">
          <Button variant="outline" className="text-muted-foreground font-normal">
            <MoveLeft /> Previous
          </Button>
          <Button variant="default">1</Button>
          <Button variant="outline" className="text-muted-foreground font-normal">
            Next <MoveRight />{" "}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptsTable;

const ReceiptsFilters = () => {

  const [amountRange, setAmountRange] = useState<number[]>([200, 600]);

  return (
    <Card className="col-span-2 self-start">
      <CardHeader className="flex items-center justify-between">
        <div className="flex flex-row items-center gap-x-2">
          <ListFilter className="size-5" /> Filters
        </div>
        <Button variant="outline" size="sm">
          Clear All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="my-6 text-xs font-semibold">
          <div className="mb-2">Date Range</div>
          <div className="flex w-full flex-row gap-2 font-semibold">
            <div className="flex-1 text-xs">
              <div className="mb-1">From</div>
              <DatePicker />
            </div>
            <div className="flex-1 text-xs">
              <div className="mb-1">To</div>
              <DatePicker />
            </div>
          </div>
        </div>
        <div className="my-6 text-xs font-semibold">
          <div className="mb-4">Amount Range (MDL)</div>
          <div className="text-muted-foreground text-xs flex justify-between items-center my-2">
            <span>{amountRange[0]!}</span>
            <span>{amountRange[1]!}</span>
          </div>
          <Slider
            defaultValue={[amountRange[0]!, amountRange[1]!]}
            onValueChange={setAmountRange}
            min={0}
            max={1000}
            step={1}
          />
        </div>
        <div className="my-6 text-xs">
          <div className="mb-2 font-semibold">Sort By</div>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Date (Newest)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Date (Newest)</SelectItem>
              <SelectItem value="oldest">Date (Oldest)</SelectItem>
              <SelectItem value="high">Amount (High to Low)</SelectItem>
              <SelectItem value="low">Amount (Low to High)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">
          Apply
        </Button>
      </CardFooter>
    </Card>
  );
};

const ReceiptsGrid = () => {
  const receipts = [
    {
      id: "1",
      url: "/receipt1.pdf",
      dateTime: new Date("2024-01-15T14:30:00Z"),
      location: "New York, NY",
      total: "125.50",
      receiptNumber: "RCP-001",
      registrationNumber: "REG-12345",
      companyName: "Tech Solutions Inc.",
      companyFiscalCode: "TSI123456789",
      createdAt: new Date("2024-01-15T14:30:00Z"),
      updatedAt: new Date("2024-01-15T14:30:00Z"),
      products: [
        {
          id: "p1",
          name: "Laptop Stand",
          quantity: "1",
          unitPrice: "45.00",
          totalPrice: "45.00",
          receiptId: "1",
        },
        {
          id: "p2",
          name: "Wireless Mouse",
          quantity: "2",
          unitPrice: "25.00",
          totalPrice: "50.00",
          receiptId: "1",
        },
        {
          id: "p3",
          name: "USB Cable",
          quantity: "3",
          unitPrice: "10.17",
          totalPrice: "30.50",
          receiptId: "1",
        },
      ],
    },
    {
      id: "2",
      url: "/receipt2.pdf",
      dateTime: new Date("2024-01-14T10:15:00Z"),
      location: "Los Angeles, CA",
      total: "89.99",
      receiptNumber: "RCP-002",
      registrationNumber: "REG-67890",
      companyName: "Digital Marketing Co.",
      companyFiscalCode: "DMC987654321",
      createdAt: new Date("2024-01-14T10:15:00Z"),
      updatedAt: new Date("2024-01-14T10:15:00Z"),
      products: [
        {
          id: "p4",
          name: "Marketing Software",
          quantity: "1",
          unitPrice: "89.99",
          totalPrice: "89.99",
          receiptId: "2",
        },
      ],
    },
    {
      id: "3",
      url: "/receipt3.pdf",
      dateTime: new Date("2024-01-13T16:45:00Z"),
      location: "Chicago, IL",
      total: "234.75",
      receiptNumber: "RCP-003",
      registrationNumber: "REG-11111",
      companyName: "Consulting Group LLC",
      companyFiscalCode: "CGL555666777",
      createdAt: new Date("2024-01-13T16:45:00Z"),
      updatedAt: new Date("2024-01-13T16:45:00Z"),
      products: [
        {
          id: "p5",
          name: "Consulting Hours",
          quantity: "5",
          unitPrice: "45.00",
          totalPrice: "225.00",
          receiptId: "3",
        },
        {
          id: "p6",
          name: "Travel Expenses",
          quantity: "1",
          unitPrice: "9.75",
          totalPrice: "9.75",
          receiptId: "3",
        },
      ],
    },
    {
      id: "4",
      url: "/receipt4.pdf",
      dateTime: new Date("2024-01-12T09:20:00Z"),
      location: "Miami, FL",
      total: "67.25",
      receiptNumber: "RCP-004",
      registrationNumber: "REG-22222",
      companyName: "Creative Studios",
      companyFiscalCode: "CS888999000",
      createdAt: new Date("2024-01-12T09:20:00Z"),
      updatedAt: new Date("2024-01-12T09:20:00Z"),
      products: [
        {
          id: "p7",
          name: "Design License",
          quantity: "1",
          unitPrice: "50.00",
          totalPrice: "50.00",
          receiptId: "4",
        },
        {
          id: "p8",
          name: "Stock Photos",
          quantity: "10",
          unitPrice: "1.50",
          totalPrice: "15.00",
          receiptId: "4",
        },
        {
          id: "p9",
          name: "Font License",
          quantity: "1",
          unitPrice: "2.25",
          totalPrice: "2.25",
          receiptId: "4",
        },
      ],
    },
  ];
  return (
    <div className="my-6 grid grid-cols-3 gap-6">
      {receipts.map((receipt) => (
        <Card
          key={receipt.id}
          className="flex h-full cursor-pointer flex-col transition-shadow hover:shadow-md"
        >
          <CardHeader className="flex justify-between">
            <div className="flex flex-row items-center gap-2">
              <FileText className="size-4" />{" "}
              <div className="bg-secondary rounded-md px-2">
                {receipt.receiptNumber}
              </div>
            </div>
            <div className="text-chart-2 font-semibold">
              MDL {receipt.total}
            </div>
          </CardHeader>
          <CardContent className="my-0 flex flex-1 flex-col py-0">
            <div className="mb-2 flex flex-row items-center text-xs">
              <MapPinIcon className="mr-2 size-4" />{" "}
              <div className="text-muted-foreground"> {receipt.location} </div>
            </div>
            <div className="mb-2 flex flex-row items-center text-xs">
              <Calendar className="mr-2 size-4" />{" "}
              <div className="text-muted-foreground">
                <TimeAgo date={receipt.createdAt} /> (
                {receipt.createdAt.toLocaleDateString()})
              </div>
            </div>
            <Separator orientation="horizontal" className="my-1" />
            <div className="text-muted-foreground text-sm">PRODUCTS (X)</div>
            <div className="my-3">
              {receipt.products.map((product) => (
                <div key={product.id} className="text-sm">
                  <div className="flex items-center justify-between">
                    {product.name}
                    <span className="text-muted-foreground text-xs">
                      {product.quantity} x {product.unitPrice}{" "}
                    </span>
                  </div>
                  <div className="text-right">MDL {product.totalPrice}</div>
                </div>
              ))}
            </div>
            <div className="mt-auto">
              <Separator orientation="horizontal" className="my-1" />
              <div className="text-muted-foreground my-0 py-0 text-right text-xs">
                Reg. no: {receipt.registrationNumber}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
