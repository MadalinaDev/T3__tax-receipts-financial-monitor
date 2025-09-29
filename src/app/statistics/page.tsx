"use server";
import StatisticsContentPage from "~/components/client/statisticsPage/statisticsContentPage";
import SpendingsOverTimeChart from "~/components/client/statisticsPage/spendingsOverTimeChart";
import { api } from "~/trpc/server";
import { type ReceiptsTableType } from "~/server/db/schema/receipts";
import { type ChartTypeSpendingsOverTime } from "~/types/statisticsCharts";


const generateSpendingsOverTime = (receipts: ReceiptsTableType[]): ChartTypeSpendingsOverTime => {
  return receipts.map((r) => ({
    id: r.id,
    name: r.dateTime.toLocaleDateString("en-GB"),
    dx: Math.floor(r.dateTime.getTime() / 1000),
    dy: Number(r.total),
  }));
};


const StatisticsPage = async () => {
  const receipts = await api.receipts.getAll();
  const chartDataSpendingsOverTime = generateSpendingsOverTime(receipts);

  return (
    <>
      <StatisticsContentPage />
      <SpendingsOverTimeChart data={chartDataSpendingsOverTime} />
    </>
  );
};

export default StatisticsPage;
