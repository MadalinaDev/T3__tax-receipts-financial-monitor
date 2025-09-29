"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { Loader2 } from "lucide-react";
import { type ApiResponse } from "~/app/api/openai/route";

const ProductsCategorizationButton = () => {
  const [responseData, setResponseData] = useState<ApiResponse>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data: receipts } = api.receipts.getAll.useQuery();

  const handleRenderStatistics = async () => {
    setIsLoading(true);
    const result = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        receipts: receipts ?? [],
      }),
    });
    const data = (await result.json()) as ApiResponse;
    setResponseData(data);
    setIsLoading(false);
  };

  return (
    <div className="mx-auto my-18 flex w-full flex-col items-center justify-center">
      <Button onClick={handleRenderStatistics} className="bg-navy-blue my-4">
        Organize Products with AI
      </Button>
      {isLoading ? (
        <Loader2 className="mx-auto my-4 animate-spin" />
      ) : (
        <div>
          <div>Tokens used: {responseData?.tokens ?? 0}</div>{" "}
          {!responseData?.success ? (
            <div>{responseData?.message}</div>
          ) : (
            <div>
              <div>{responseData?.message}</div>
              <div>
                {responseData?.data?.map((a) => (
                  <div key={a.id}>
                    <div className="flex flex-row">
                      {" "}
                      <div className="font-semibold">Name:</div> {a.name}
                    </div>
                    <div className="flex flex-row">
                      {" "}
                      <div className="font-semibold">Category:</div>{" "}
                      {a.category}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductsCategorizationButton;
