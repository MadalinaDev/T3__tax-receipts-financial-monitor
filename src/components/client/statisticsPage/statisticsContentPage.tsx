"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

// partial type definition for the object returned from the API
type OpenAIResponseType = {
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
  }[];
  usage: {
    total_tokens: number;
  };
};

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
    const data = (await result.json()) as OpenAIResponseType;
    console.log(data);
    const fallbackResponse =
      "No answer from OpenAI. Check console for more details.";
    console.log(data.choices[0]?.message.content ?? fallbackResponse);
    setAnswer(data.choices[0]?.message.content ?? fallbackResponse);
    setTokens(data.usage.total_tokens);
  };

  return (
    <>
      <div className="my-12 flex w-140 flex-col">
        <Button onClick={handleRenderStatistics} className="bg-navy-blue my-4">
          Process your receipts with OpenAI!
        </Button>
        <div>Response: {answer}</div>
        <div>Tokens used: {tokens}</div>
      </div>
    </>
  );
};

export default StatisticsContentPage;
