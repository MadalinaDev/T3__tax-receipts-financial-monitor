"use server";

import { Suspense } from "react";
import StatisticsContent from "~/components/client/statisticsPage/statisticsContent";
import LoadingStatistics from "~/components/client/statisticsPage/loadingStatistics";

const StatisticsPage = async () => {

  return (
    <Suspense fallback={<LoadingStatistics />}>
      <StatisticsContent />
    </Suspense>
  );
};

export default StatisticsPage;
