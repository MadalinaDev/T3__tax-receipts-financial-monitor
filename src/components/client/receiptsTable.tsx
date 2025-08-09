"use client";
import {
  Card,
  CardHeader,
  CardContent,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import {
  FileText,
  Search,
  ListFilter,
  MapPinIcon,
  Calendar,
} from "lucide-react";
import TimeAgo from "react-timeago";

const ReceiptsTable = () => {
  return (
    <div className="my-8 grid w-full grid-cols-4 gap-x-8">
      <ReceiptsFilters />
      <div className="col-span-3">
        <div className="relative">
          <Search className="absolute top-3 left-3 size-4" />
          <Input
            placeholder="Search receipts..."
            // value={searchTerm}
            // onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <ReceiptsGrid />
      </div>
    </div>
  );
};

export default ReceiptsTable;

const ReceiptsFilters = () => {
  return (
    <Card className="col-span-1">
      <CardHeader className="flex items-center justify-between">
        <div className="flex flex-row items-center gap-x-2">
          <ListFilter className="size-5" /> Filters
        </div>
        <Button variant="outline" size="sm">
          Clear All
        </Button>
      </CardHeader>
      <CardContent></CardContent>
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
                <TimeAgo date={receipt.createdAt} />{" "} ({receipt.createdAt.toLocaleDateString()})
              </div>
            </div>
            <Separator orientation="horizontal" className="my-1" />
            <div className="text-muted-foreground text-sm">PRODUCTS (X)</div>
            <div className="my-3">
              {receipt.products.map((product) => (
                <div key={product.id} className="text-sm">
                  <div className="flex justify-between items-center">
                    {product.name}
                    <span className="text-xs text-muted-foreground">
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
