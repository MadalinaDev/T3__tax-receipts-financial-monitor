"use client";
import { Loader2 } from "lucide-react";

const PageLoader = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Loader2 className="text-navy-blue animate-spi\n" />
    </div>
  );
};

export default PageLoader;
