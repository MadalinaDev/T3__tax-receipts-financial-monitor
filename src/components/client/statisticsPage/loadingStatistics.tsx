"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { CheckCircle2, BarChart3, Sparkles } from "lucide-react";

type LoadingStep = "categorizing" | "building" | "complete";

const LoadingStatistics = () => {
  const categorizationDuration = 600;
  const chartBuildingDuration = 900;

  const [currentStep, setCurrentStep] = useState<LoadingStep>("categorizing");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const categorizationTimer = setTimeout(() => {
      setCurrentStep("building");
      setProgress(65);
    }, categorizationDuration);

    const chartTimer = setTimeout(() => {
      setCurrentStep("complete");
      setProgress(100);
    }, categorizationDuration + chartBuildingDuration);

    return () => {
      clearTimeout(categorizationTimer);
      clearTimeout(chartTimer);
    };
  }, [categorizationDuration, chartBuildingDuration]);

  const getStepContent = () => {
    switch (currentStep) {
      case "categorizing":
        return {
          icon: Sparkles,
          text: "Categorizing products with OpenAI",
        };
      case "building":
        return {
          icon: BarChart3,
          text: "Building statistics charts",
        };
      case "complete":
        return {
          icon: CheckCircle2,
          text: "Statistics ready",
        };
    }
  };

  const stepContent = getStepContent();
  const StepIcon = stepContent.icon;

  return (
    <div className="my-22 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-10">
          <div className="text-navy-blue mb-8 flex flex-col items-center gap-6">
            <div className="relative flex h-32 w-32 items-center justify-center">
              {currentStep === "complete" ? (
                <StepIcon className="text-navy-blue animate-in zoom-in h-20 w-20 duration-500" />
              ) : (
                <StepIcon className="h-20 w-20 animate-pulse" />
              )}
            </div>

            <p className="text-muted-navy-blue animate-pulsetext-center text-sm font-medium duration-300">
              {stepContent.text}
            </p>
          </div>

          <div className="bg-secondary text-navy-blue h-2 w-full overflow-hidden rounded-full">
            <div
              className="bg-muted-navy-blue h-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoadingStatistics;
