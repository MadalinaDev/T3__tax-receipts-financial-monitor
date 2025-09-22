"use client";
import { Button } from "~/components/ui/button";
import { RefreshCw } from "lucide-react";


const RetryScrapeButton = ({fetchScrape} : {fetchScrape: () => void;}) => {

    return (
      <Button
        variant="outline"
        onClick={fetchScrape}
        className="mx-auto flex items-center gap-2"
      >
        Retry <RefreshCw className="size-6" />
      </Button>
    );
}

export default RetryScrapeButton;