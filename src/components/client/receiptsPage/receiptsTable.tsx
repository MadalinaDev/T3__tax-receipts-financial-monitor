"use client";
import { useEffect } from "react";
import { Card, CardHeader, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
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
import { DatePicker } from "~/components/ui/date-picker";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "~/components/ui/select";
import { Slider } from "~/components/ui/slider";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationEllipsis,
} from "~/components/ui/pagination";
import { api } from "~/trpc/react";
import type { ReceiptWithProducts } from "~/types/receipt";
import { parseAsInteger, useQueryState } from "nuqs";

const DEFAULT_PAGE = 1;
const DEFAULT_TOTAL_ITEMS = 3;
const DEFAULT_AMOUNT_START = 0;
const DEFAULT_AMOUNT_END = 800;
type SortByType = "date-desc" | "date-asc" | "amount-asc" | "amount-desc";

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
  const [dateStart, setDateStart] = useQueryState("dateStart", {
    defaultValue: "",
  });
  const [dateEnd, setDateEnd] = useQueryState("dateEnd", {
    defaultValue: "",
  });
  const [amountStart, setAmountStart] = useQueryState(
    "amountStart",
    parseAsInteger.withDefault(DEFAULT_AMOUNT_START),
  );
  const [amountEnd, setAmountEnd] = useQueryState(
    "amountEnd",
    parseAsInteger.withDefault(DEFAULT_AMOUNT_END),
  );
 const [sortBy, setSortBy] = useQueryState<SortByType>("sortBy", {
   parse: (v) =>
    v === "date-desc" || v === "date-asc" || v === "amount-asc" || v === "amount-desc"
      ? v
      : "date-desc",
 });
  // -------------------------------------------------------------

  const { data: receipts, isPending } = api.receipts.get.useQuery({
    page,
    totalItems,
    search: currentSearch,
    filters: {
      dateStart,
      dateEnd,
      amountStart,
      amountEnd,
    },
    sortBy,
  });

  const totalPages = Math.ceil((receipts?.totalCount ?? 0) / totalItems);

  useEffect(() => {
    if (!receipts) return;
    if (page > totalPages) void setPage(DEFAULT_PAGE);
    if (totalItems > receipts.totalCount!)
      void setTotalItems(DEFAULT_TOTAL_ITEMS);
    if (page < 1) void setPage(DEFAULT_PAGE);
    if (totalItems < 1) void setTotalItems(DEFAULT_TOTAL_ITEMS);
    // TO DO: add some limits in the interaction of the user with the filters 
    // that can be doen throguh the URL manipulation
  }, [receipts, page, totalItems, currentSearch]);

  const pageButtonNumbers: number[] = [];
  for (let i = page - 2; i <= page + 2; i++) {
    if (i <= 0 || (!isPending && i > totalPages)) continue;
    pageButtonNumbers.push(i);
  }

  return (
    <div className="my-8 grid grid-cols-1 md:grid-cols-7 md:gap-x-8 w-full">
      <ReceiptsFilters
        dateStart={dateStart}
        setDateStart={setDateStart}
        dateEnd={dateEnd}
        setDateEnd={setDateEnd}
        amountStart={amountStart}
        setAmountStart={setAmountStart}
        amountEnd={amountEnd}
        setAmountEnd={setAmountEnd}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <div className="md:col-span-5">
        <div className="flex flex-row gap-2">
          <div className="relative flex-11">
            <Search className="absolute top-3 left-3 size-4" />
            <Input
              placeholder="Search receipts..."
              className="text-muted-navy-blue pl-9"
              value={currentSearch}
              onChange={(e) => setCurrentSearch(e.target.value)}
            />
            <X
              className="absolute top-3 right-3 size-4 hover:cursor-pointer"
              onClick={() => setCurrentSearch("")}
            />
          </div>
          <Select onValueChange={(value) => setTotalItems(Number(value))}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder={`${DEFAULT_TOTAL_ITEMS} items`} />
            </SelectTrigger>
            <SelectContent className="text-muted-navy-blue">
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

const ReceiptsFilters = ({
  dateStart,
  dateEnd,
  setDateStart,
  setDateEnd,
  amountStart,
  setAmountStart,
  amountEnd,
  setAmountEnd,
  sortBy,
  setSortBy,
}: {
  dateStart: string;
  dateEnd: string;
  setDateStart: (date: string) => void;
  setDateEnd: (date: string) => void;
  amountStart: number;
  setAmountStart: (amount: number) => void;
  amountEnd: number;
  setAmountEnd: (amount: number) => void;
  sortBy: SortByType | null;
  setSortBy: (by: SortByType | null) => void;
}) => {

  const clearAllFilters = () => {
    setDateStart("");
    setDateEnd("");
    setAmountStart(DEFAULT_AMOUNT_START);
    setAmountEnd(DEFAULT_AMOUNT_END);
    setSortBy("date-desc");
  }

  return (
    <Card className="mb-12 md:col-span-2 md:self-start w-xs">
      <CardHeader className="flex items-center justify-between">
        <div className="text-navy-blue flex flex-row items-center gap-x-2">
          <ListFilter className="size-5" /> Filters
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-muted-navy-blue/70"
          onClick={clearAllFilters}
        >
          Clear All
        </Button>
      </CardHeader>
      <CardContent className="text-navy-blue">
        <div className="text-navy-blue my-6 text-xs font-semibold">
          <div className="mb-2">Date Range</div>
          <div className="flex w-full flex-row gap-2 font-semibold">
            <div className="flex-1 text-xs">
              <div className="mb-1">From</div>
              <DatePicker value={dateStart} setValue={setDateStart} />
            </div>
            <div className="flex-1 text-xs">
              <div className="mb-1">To</div>
              <DatePicker value={dateEnd} setValue={setDateEnd} />
            </div>
          </div>
        </div>
        <div className="text-navy-blue my-6 text-xs font-semibold">
          <div className="mb-4">Amount Range (MDL)</div>
          <div className="text-navy-blue my-2 flex items-center justify-between text-xs">
            <span>{amountStart}</span>
            <span>{amountEnd}</span>
          </div>
          {/* TO DO: ADD A DEBOUNCER TO THIS SLIDER */}
          <Slider
            defaultValue={[amountStart, amountEnd]}
            onValueChange={(values) => {
              if (values[0] !== undefined) setAmountStart(values[0]);
              if (values[1] !== undefined) setAmountEnd(values[1]);
            }}
            min={0}
            max={1000}
            step={10}
            className=""
          />
        </div>
        <div className="text-navy-blue my-6 text-xs">
          <div className="mb-2 font-semibold">Sort By</div>
          <Select
            value={sortBy ?? undefined}
            onValueChange={(v) => setSortBy(v as SortByType)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Date (Newest)" />
            </SelectTrigger>
            <SelectContent className="text-muted-navy-blue">
              <SelectItem value="date-desc">Date (Newest)</SelectItem>
              <SelectItem value="date-asc">Date (Oldest)</SelectItem>
              <SelectItem value="amount-desc">Amount (High to Low)</SelectItem>
              <SelectItem value="amount-asc">Amount (Low to High)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

const ReceiptsGrid = ({ receipts }: { receipts: ReceiptWithProducts[] }) => {
  return (
    <div className="text-navy-blue my-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {receipts.map((receipt) => (
        <Card
          key={receipt.id}
          className="flex h-full cursor-pointer flex-col transition-shadow hover:shadow-md"
        >
          <CardHeader className="text-navy-blue flex justify-between">
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
          <CardContent className="text-navy-blue my-0 flex flex-1 flex-col py-0">
            <div className="mb-2 flex flex-row items-center text-xs">
              <MapPinIcon className="mr-2 size-4" />{" "}
              <div className="text-navy-blue"> {receipt.location} </div>
            </div>
            <div className="mb-2 flex flex-row items-center text-xs">
              <Calendar className="mr-2 size-4" />{" "}
              <div className="text-navy-blue">
                <TimeAgo date={receipt.dateTime} /> (
                {receipt.dateTime.toLocaleDateString()})
              </div>
            </div>
            <Separator orientation="horizontal" className="my-1" />
            <div className="text-navy-blue text-sm font-medium">
              PRODUCTS ({receipt.products.length})
            </div>
            <div className="text-navy-blue my-3">
              {receipt.products.slice(0, 3).map((product) => (
                <div key={product.id} className="text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate max-w-[70%]">{product.name}</span>
                    <span className="text-navy-blue text-xs whitespace-nowrap">
                      {product.quantity} x {product.unitPrice}{" "}
                    </span>
                  </div>
                  <div className="text-right font-medium">
                    MDL {product.totalPrice}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-auto">
              <Separator orientation="horizontal" className="my-1" />
              <div className="text-navy-blue my-0 py-0 text-right text-xs">
                Reg. no: {receipt.registrationNumber}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
