"use client";

import {
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { type ChartTypeSpendingsOverTime } from "~/types/statisticsCharts";

const SpendingsOverTimeChart = ({
  data,
}: {
  data: ChartTypeSpendingsOverTime;
}) => {
  return (
    <>
      <div className="flex flex-col gap-0">
        <p className="text-lg font-semibold">Spending Over Time</p>
        <p className="text-md">By receipt spending trends (MDL)</p>
      </div>
      <div className="my-4 h-80 w-full lg:mx-12 lg:mb-10">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 15, right: 5, left: 5, bottom: 35 }}
          >
            <CartesianGrid strokeDasharray="1 1" />
            <XAxis dataKey="name" />
            <YAxis dataKey="dy" />
            <Tooltip />
            <Line type="monotone" dataKey="dy" stroke="#2a2d70" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default SpendingsOverTimeChart;
