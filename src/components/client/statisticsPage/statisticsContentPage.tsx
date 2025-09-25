"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

const StatisticsContentPage = () => {
  const [answer, setAnswer] = useState<string>("...");
  const [tokens, setTokens] = useState<number>(0);

  const { data: receipts } = api.receipts.get.useQuery({
    page: 1,
    totalItems: 100,
    filters: null,
    sortBy: null,
    search: null,
  });

  const handleRenderStatistics = async () => {
    const result = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        receipts,
      }),
    });
    const data = await result.json();
    console.log(data);
    console.log(data.choices[0].message.content);
    setAnswer(data.choices[0].message.content);
    setTokens(data.usage.total_tokens);
  };

  return (
    <>
      <div className="my-12 flex w-140 flex-col">
        <Button onClick={handleRenderStatistics} className="my-4 bg-navy-blue" disabled>
          Process your receipts with OpenAI!
        </Button>
        <div>Response: {answer}</div>
        <div>Tokens used: {tokens}</div>
      </div>
    </>
  );
};

export default StatisticsContentPage;
