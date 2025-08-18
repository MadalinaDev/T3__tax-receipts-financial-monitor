import ReceiptsTable from "~/components/client/receiptsTable";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

const ReceiptsPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] flex flex-col justify-center items-center w-full">
          <Loader2 className="mx-auto animate-spin" />
        </div>
      }
    >
      <ReceiptsTable />
    </Suspense>
  );
};

export default ReceiptsPage;
