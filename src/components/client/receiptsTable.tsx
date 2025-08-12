"use client";
import { useState, useEffect } from "react";
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
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationEllipsis,
} from "../ui/pagination";
import { api } from "~/trpc/react";
import type { ReceiptWithProducts } from "~/types/receipt";
import { parseAsInteger, useQueryState } from "nuqs";

const DEFAULT_PAGE = 1;
const DEFAULT_TOTAL_ITEMS = 3;

const ReceiptsTable = () => {

  // -------- nuqs state management for URL params -------------
  const [currentSearch, setCurrentSearch] = useQueryState("search", {
    defaultValue: "",
  });
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(DEFAULT_PAGE),
  );
  const [totalItems, setTotalItems] = useQueryState(
    "totalItems",
    parseAsInteger.withDefault(DEFAULT_TOTAL_ITEMS),
  );
  // -------------------------------------------------------------

  const { data: receipts, isPending } = api.receipts.get.useQuery({
    page,
    totalItems,
    search: currentSearch,
  });

  const totalPages = Math.ceil((receipts?.totalCount ?? 0) / totalItems);

  useEffect(() => {
    if (!receipts) return;
    if (page > totalPages) void setPage(DEFAULT_PAGE);
    if (totalItems > receipts.totalCount!) void setTotalItems(DEFAULT_TOTAL_ITEMS);
    if (page < 1) void setPage(DEFAULT_PAGE);
    if (totalItems < 1) void setTotalItems(DEFAULT_TOTAL_ITEMS);
  }, [receipts, page, totalItems, currentSearch]);

  const pageButtonNumbers: number[] = [];
  for (let i = page - 2; i <= page + 2; i++) {
    if (i <= 0 || (!isPending && i > totalPages)) continue;
    pageButtonNumbers.push(i);
  }

  return (
    <div className="my-8 grid w-full grid-cols-7 gap-x-8">
      <ReceiptsFilters />
      <div className="col-span-5">
        <div className="flex flex-row gap-2">
          <div className="relative flex-11">
            <Search className="absolute top-3 left-3 size-4" />
            <Input
              placeholder="Search receipts..."
              className="pl-9"
              value={currentSearch}
              onChange={(e) => setCurrentSearch(e.target.value)}
            />
            <X className="absolute right-3 top-3 size-4 hover:cursor-pointer" onClick={() => setCurrentSearch("")}/>
          </div>
          <Select onValueChange={(value) => setTotalItems(Number(value))}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder={`${DEFAULT_TOTAL_ITEMS} items`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 items</SelectItem>
              <SelectItem value="3">3 items</SelectItem>
              <SelectItem value="6">6 items</SelectItem>
              <SelectItem value="9">9 items</SelectItem>
              <SelectItem value="12">12 items</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {isPending ? (
          <div className="my-[15%] w-full">
            <Loader2 className="mx-auto animate-spin" />
          </div>
        ) : (
          <div>
            <ReceiptsGrid receipts={receipts?.items ?? []} />
            <Pagination>
              <PaginationContent>
                {page > 1 && (
                  <>
                    <PaginationItem>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((prev) => prev - 1)}
                      >
                        <ChevronLeft /> Previous
                      </Button>
                    </PaginationItem>
                    {pageButtonNumbers[0] !== 1 && <PaginationEllipsis />}
                  </>
                )}

                {pageButtonNumbers.map((pageNumber) => (
                  <PaginationItem key={pageNumber}>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPage(pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  </PaginationItem>
                ))}

                {!isPending && page < totalPages && (
                  <>
                    {page + 2 < totalPages && <PaginationEllipsis />}
                    <PaginationItem>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPage((prev) => prev + 1)}
                      >
                        Next <ChevronRight />
                      </Button>
                    </PaginationItem>
                  </>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
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
          <div className="text-muted-foreground my-2 flex items-center justify-between text-xs">
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

const ReceiptsGrid = ({ receipts }: { receipts: ReceiptWithProducts[] }) => {
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
                <TimeAgo date={receipt.dateTime} /> (
                {receipt.dateTime.toLocaleDateString()})
              </div>
            </div>
            <Separator orientation="horizontal" className="my-1" />
            <div className="text-muted-foreground text-sm">
              PRODUCTS ({receipt.products.length})
            </div>
            <div className="my-3">
              {receipt.products.slice(0, 3).map((product) => (
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
