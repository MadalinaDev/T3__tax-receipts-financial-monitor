"use client";
import { Hammer, Wrench, Cog } from "lucide-react";

const UnderConstruction = () => {
  return (
    <div className="my-48 flex items-center justify-center px-4 md:my-24">
      <div className="space-y-6 text-center">
        <div className="mb-8 flex justify-center gap-6">
          <Hammer
            className="text-navy-blue/95 h-12 w-12 animate-bounce"
            style={{ animationDelay: "0s" }}
          />
          <Wrench
            className="text-navy-blue/95 h-12 w-12 animate-bounce"
            style={{ animationDelay: "0.2s" }}
          />
          <Cog className="text-navy-blue/95 h-12 w-12 animate-spin" />
        </div>

        <h1 className="text-navy-blue text-2xl font-semibold">
          Under Construction
        </h1>
        <p className="text-navy-blue/80 text-sm">
          We&lsquo;re working on something great.
        </p>
      </div>
    </div>
  );
};

export default UnderConstruction;
